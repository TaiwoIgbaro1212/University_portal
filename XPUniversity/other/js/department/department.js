const addDepartmentForm = document.getElementById('addDepartmentForm');
const table = document.getElementById('table-body');
const BASE_URL = 'http://192.168.17.220:8097';
let departments = [];
let faculties = [];
let globalDepartmentId;


const renderTable = () => {
  departments.forEach((department, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${department.FacultyId}</td>
      <td>${department.Name}</td>
      <td>${department.UniqueId}</td>
      <td>${department.Code}</td>
      <td>${department.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
      <button 
      onclick="handleEditClick(${department.DepartmentId})" 
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#editModal">Edit</button>

        <button class="btn btn-danger"  onclick="deletedepartment(${department.DepartmentId})">Delete</button>
      </td>`;
    table.appendChild(row);
  });
}


const generateSelectOptions = () => {
  const selects = document.querySelectorAll('.facultySelect');
  // console.log(faculties)
  selects.forEach(select => {
    faculties.forEach(faculty => {
      const op = document.createElement('option')
      op.value = faculty.FacultyId
      op.innerText = faculty.Name
      select.appendChild(op)
    })
  })
}
const populate = async () => {
  try {
    // const table = document.getElementById('table-body');
    const response = await axios.get(`${BASE_URL}/api/v1/departments/`);
    const data = response.data;
    departments = data

    const response2 = await axios.get(`${BASE_URL}/api/v1/faculties`);
    const data2 = response2.data;
    faculties = data2

    renderTable()
    generateSelectOptions()
  } catch (error) {
    console.log(error);
  }

}

document.addEventListener('DOMContentLoaded', populate);

//  SEARCH AREA

const searchModalForm = document.querySelector('#searchModalForm');
const searchModal = document.getElementById("searchModal");
const searchModalEvent = new MouseEvent('click', {

  view: window,
  bubbles: true,
  cancelable: true
});

searchModalForm.addEventListener('submit', searchDepartmentForm)

async function searchDepartmentForm(e) {
  e.preventDefault()
  table.innerHTML = null

  const formData = new FormData(searchModalForm);
  const searchFormData = Object.fromEntries(formData.entries());
  if (searchFormData.Status) {
    searchFormData.Status = 1;
  } else {
    searchFormData.Status = 0;
  }

  console.log(searchFormData);
  const fetchFilter = await axios.post(`${BASE_URL}/api/v1/departments/`, searchFormData);
  const resultFilter = await fetchFilter
  const filteredData = resultFilter.data

  if (filteredData.length < 1) {
    setTimeout(() => {
      alert('No Such Data Exist')
    }, 1000);
  }

  filteredData.forEach((department, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${index + 1}</td>
    <td>${department.Name}</td>
    <td>${department.UniqueId}</td>
    <td>${department.Code}</td>
    <td>${department.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
    <td>
    <button 
    onclick="handleEditClick(${department.DepartmentId})" 
    class="btn btn-primary"
    data-toggle="modal"
    data-target="#editModal">Edit</button>

      <button class="btn btn-danger"  onclick="deletedepartment(${department.DepartmentId})">Delete</button>`;
    table.appendChild(row);
  });
}
// DELETE DEPARTMENT

function deletedepartment(id) {
  // console.log(id);
  axios.delete(`${BASE_URL}/api/v1/departments/` + id).then((res) => {
    window.location.reload()
  }).catch((err) => {
    console.log(err);
  })
}

addDepartmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(addDepartmentForm);
  const data = Object.fromEntries(formData.entries());
  // validate checkbox
  if (data.Status) {
    data.Status = 1;
  } else {
    data.Status = 0;
  }
  console.log(data);

  const validate = new Validate();
  validate.length(data.Name, 3, 50, 'Name');
  validate.length(data.UniqueId, 3, 10, 'UniqueId');
  validate.length(data.Code, 3, 10, 'Code');

  if (validate.errors.length > 0) {
    alert(validate.errors[0]);
    return;
  } else {
    console.log(data);
    // Make post request
    axios.post(`${BASE_URL}/api/v1/departments/add`, data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})


// -------------EDIT SESSION --------------------------------

// GET ALL OUR INPUTS READY AHEAD OF TIME 
const facultyIdInput = document.querySelector('#facultyId');
// Get information from the id parameter
function handleEditClick(departmentId) {

  // get particular department to edit
  const department = departments.find(department => department.DepartmentId === departmentId);

  //fill in form values with department information
  populateEditForm(department);
  globalDepartmentId = departmentId;
}

function populateEditForm(department) {
  const editForm = document.getElementById('editingForm')
  Array.from(editForm.elements).forEach((element) => {

    if (element.name === 'Status') {
      element.checked = department[element.name] === 1 ? true : false;
    }
    if (department.hasOwnProperty(element.name)) {
      element.value = typeof department[element.name] === 'string' ? department[element.name].trim() : department[element.name];
    }
  })
}


// SUBMIT FORM TO EDIT THE DB
const editForm = document.querySelector('#editingForm');
editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // GET FORM DATA AS AN OBJECT
  const formData = new FormData(editForm);
  const data = Object.fromEntries(formData.entries());

  // SET STATUS TO EITHER 1 OR 0
  data.Status = data.Status ? 1 : 0;

  // GET GLOBAL FACULTYID
  data.DepartmentId = globalDepartmentId;

  //RESET GLOBAL FACULTYID
  globalDepartmentId = undefined;

  console.log(data)

  validate.isChosen(data.FacultyId, "Faculty Name")
  validate.length(data.Name, 3, 50, 'Name');
  validate.length(data.UniqueId, 3, 10, 'UniqueId');
  validate.length(data.Code, 3, 10, 'Code');



  console.log(data)

  // CHECK FOR ERROR BEFORE PUTING
  if (validate._errors.length > 0) {
    alert(validate._errors[0])
  } else {
    // Make put request
    axios.put(`${BASE_URL}/api/v1/departments/`, data).then((result) => {
      console.log(result);


      const index = faculties.findIndex(department => department.DepartmentId === data.DepartmentId);
      faculties[index] = data;
      renderTable()
      $(editModal).modal('hide')
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }
});


