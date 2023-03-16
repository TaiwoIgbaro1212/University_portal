// GET ALL OUR INPUTS READY AHEAD OF TIME 
// const departmentIdInput = document.querySelector('#departmentIdInput');
const facultyIdInput = document.querySelector('#facultyId');
const nameInput = document.querySelector('#nameInput');
const uniqueIdInput = document.querySelector('#uniqueIdInput');
const codeInput = document.querySelector('#codeInput');
const statusInput = document.querySelector('#statusInput');
const editingForm = document.querySelector('#editingForm');

let faculties = [];
let department = null;

const generateSelectOptions = async () => {
	const response2 = await axios.get('http://localhost:8097/api/v1/faculties');
	const data2 = response2.data;
	faculties = data2
	const select = document.querySelector('.facultySelect')

	faculties.forEach(faculty => {
		const op = document.createElement('option')
		op.value = faculty.FacultyId
		op.innerText = faculty.Name
		select.appendChild(op)
	})
}


// GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');


// Get information from the id parameter
const getDepartmentById = async () => {
	const dataObj = await axios.get(`http://localhost:8097/api/v1/departments/${paramValue}`)
	const data = await dataObj.data
	department = data
	nameInput.value = data.Name.trim();
	uniqueIdInput.value = data.UniqueId.trim();
	codeInput.value = data.Code.trim();
	statusInput.value = data.Status;

	generateSelectOptions()
}

document.addEventListener('DOMContentLoaded', getDepartmentById);


// SUBMIT FORM TO EDIT THE DB
editingForm.addEventListener('submit', (e) => {
	e.preventDefault();
	// GET INPUT TO EDIT
	const nameInput = document.querySelector('#nameInput');
	const uniqueIdInput = document.querySelector('#uniqueIdInput');
	const codeInput = document.querySelector('#codeInput');
	const statusInput = document.querySelector('#statusInput');

	// INITIALIZE OUR VALIDATOR FUNCTION
	const validate = new Validate();

	console.log(facultyIdInput)

	// OBEJCT TO SEND TO DB
	const submitForm = {
		"DepartmentId": Number(department.DepartmentId),
		"Name": nameInput.value,
		"FacultyId": facultyIdInput.value,
		"UniqueId": uniqueIdInput.value,
		"Code": codeInput.value,
		"Status": Number(statusInput.value)
	}

	validate.isChosen(submitForm.FacultyId, "Faculty Name")
	validate.length(submitForm.Name, 3, 50, 'Name');
	validate.length(submitForm.UniqueId, 3, 10, 'UniqueId');
	validate.length(submitForm.Code, 3, 10, 'Code');



	console.log(submitForm)

	// CHECK FOR ERROR BEFORE PUTING
	if (validate._errors.length > 0) {
		alert(validate._errors[0])
	} else {
	// 	// Make put request
		axios.put('http://localhost:8097/api/v1/departments', submitForm).then((result) => {
			console.log(result);
			window.location.href = 'http://localhost:5500/XPUniversity/other/html/department/department.html'
		}).catch((err) => {
			console.log(err);
		});
	}
}); 