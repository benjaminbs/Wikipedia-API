
const _button = document.querySelector('#btnSearch');
const _input = document.querySelector('#inputSearch');
const _error = document.querySelector('#errorSearch');
const _result = document.querySelector('#resultSearch');

const endpoint = 'https://es.wikipedia.org/w/api.php?';
const params = {
	origin: '*',
	format: 'json',
	action: 'query',
	prop: 'extracts|pageimages',
	exchars: 250,
	exintro: true,
	explaintext: true,
	pithumbsize: 300,
	generator: 'search',
	gsrlimit: 20,
}



const disableInp = () => {
	_input.disabled = true;
	_button.disabled = true;
}

const enableInp = () => {
	_input.disabled = false;
	_button.disabled = false;
}

const clearPrevResults = () => {
	_result.innerHTML = '';
	_error.innerHTML = '';
}

const isEmpty = (_input) => {
	if (!_input || _input === '') return true
	return false;
}


const showError = (error) => {
	_error.innerHTML = `${error} `;
}

const showResults = (results) =>{
	let imageLink;
	results.forEach(result => {
		result.imagen == undefined? imageLink="default.png": imageLink = result.imagen.source;
	
		_result.innerHTML += `
		<div class="col-md-6 col-sm-12">
			<a href="https://es.wikipedia.org/?curid=${result.pageId}" class="_linkWiki">
				<div class="card mb-3">
					<div class="row no-gutters">
						<div class="col-md-4">
							<img src="${imageLink}" class="p-2 card-img">
						</div>
						<div class="col-md-8">
							<div class="card-body">
								<h5 class="card-title" href="">${result.title}</h5>
								<p class="card-text">${result.intro}</p>
							</div>
						</div>
					</div>
				</div>
			</a>
		</div>
		`;
	});
}

const getPages = pages =>{
	const results = Object.values(pages).map(page=> ({
		pageId: page.pageid,
		title: page.title,
		intro: page.extract,
		imagen: page.thumbnail
	}));
	//console.log(results)
	showResults(results)
}

const getData = async () => {
	const txtInput = _input.value;
	if(isEmpty(txtInput)) return;

	params.gsrsearch = txtInput;
	params.titles = txtInput;
	clearPrevResults();
	disableInp();

	try{
		const { data } = await axios.get(endpoint, { params });
		console.log(data)
		//Verficará si al traer la información hay un error, si lo hay activará el catch
		if(data.error) throw new Error(data.error.info);

		getPages(data.query.pages)
	}catch(error){
		showError(error)

	}finally{
		enableInp();
	}

	
};

const handleKeyEvent = e => {
	if(e.key === 'Enter'){
		getData()
	}
}

const registerEventHandlers = () => {
	_input.addEventListener('keydown', handleKeyEvent)
	_button.addEventListener('click', getData)
}

registerEventHandlers();

const btn = document.querySelector(".btn-toggle");
const span = document.querySelector("#spanDarkMode");

btn.addEventListener("click", function () {
  if (document.body.classList.contains('dark-theme')) {
	document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
	span.textContent  = 'nightlight_round'
  } else {
	document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
	span.textContent  = 'wb_sunny'

  }
});