let FACULTIES = []
const BASE_URL = 'http://192.168.17.220:8097';
let globalFacultyId;


const addFacultyForm = document.getElementById('addFacultyForm');

const renderTable = () => {
  // console.log('render table called');
  const table = document.getElementById('table-body');
  const filteredData = FACULTIES;
  const tableContent = filteredData.map((faculty, index) => {
    return `
      <tr>
      <td>${index + 1}</td>
      <td>${faculty.Name}</td>
      <td>${faculty.UniqueId}</td>
      <td>${faculty.Code}</td>
      <td>${faculty.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
        <button 
          onclick="handleEditClick(${faculty.FacultyId})" 
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#editModal">Edit</button>
        <button class="btn btn-danger"  onclick="deletefaculty(${faculty.FacultyId})">Delete</button>
      </td>
      </tr>
    `;
  }).join('');
  table.innerHTML = tableContent;
}
const populate = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/faculties`);
    FACULTIES = response.data;
    filteredData = response.data;
    renderTable()
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', populate);





// SEARCH AREA
// const searchModalForm = document.querySelector('#searchModalForm');
// const searchModal = document.getElementById("searchModal");
// const searchModalEvent = new MouseEvent('click', {

//   view: window,
//   bubbles: true,
//   cancelable: true
// });


// searchModalForm.addEventListener('submit', searchFacultyForm)
// async function searchFacultyForm(e) {
//   e.preventDefault()
//   table.innerHTML = null

//   const formData = new FormData(searchModalForm);
//   const searchFormData = Object.fromEntries(formData.entries());
//   if (searchFormData.Status) {
//     searchFormData.Status = 1;
//   } else {
//     searchFormData.Status = 0;
//   }
//   console.log(searchFormData);

//   const fetchFilter = await axios.post(`${BASE_URL}/api/v1/faculties/`, searchFormData);
//   const resultFilter = await fetchFilter
//   const filteredData = resultFilter.data

//   if (filteredData.length < 1) {
//     setTimeout(() => {
//       alert('No Such Data Exist')
//     }, 1000);
//   }

//   filteredData.forEach((faculty, index) => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>${index + 1}</td>
//       <td>${faculty.Name}</td>
//       <td>${faculty.UniqueId}</td>
//       <td>${faculty.Code}</td>
//       <td>${faculty.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
//       <td>
//         <button onclick="getFacultyById(${faculty.FacultyId})" class="btn btn-primary">Edit</button>
//         <button class="btn btn-danger"  onclick="deletefaculty(${faculty.FacultyId})">Delete</button>
//         <a href="../../html/faculty/detailfaculty.html?id=${faculty.FacultyId}" class="btn btn-success">Details</a>
//       </td>
//     `;
//     table.appendChild(row);
//   });
// }

async function deletefaculty(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/api/v1/faculties/${id}`)
    console.log(res)
    window.location.reload()
  } catch (err) {
    console.log(err.response.data.Error);
    const container = document.querySelector('#table-wrapper');
    const errdiv = document.createElement('div');
    errdiv.classList = "alert alert-danger";
    errdiv.innerText = err.response.data.Error;
    container.prepend(errdiv);
    setTimeout(() => errdiv.remove(), 3000);
  }
}


addFacultyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(addFacultyForm);
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
    axios.post(`${BASE_URL}/api/v1/faculties/add`, data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})

// ==================================EDIT FORM==============================



// GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2
// const params = new URLSearchParams(window.location.search);
// // Get the value of the 'id' parameter
// const paramValue = params.get('id');
// facultyIdInput.value = paramValue;


// Get information from the id parameter
function handleEditClick(facultyId) {

  // get particular faculty to edit
  const faculty = FACULTIES.find(faculty => faculty.FacultyId === facultyId);

  // fill in form values with faculty information
  populateEditForm(faculty);

  globalFacultyId = facultyId;
}


function populateEditForm(faculty) {
  const editForm = document.getElementById('editingForm')
  Array.from(editForm.elements).forEach((element) => {
    if (element.name === 'Status') {
      element.checked = faculty.Status === 1 ? true : false;
      return;
    }
    element.value = faculty.hasOwnProperty(element.name) ? faculty[element.name].trim() : ''
  });
}

// GET FORM AND ADD SUBMIT EVENT LISTENER
const editForm = document.querySelector('#editingForm');
editingForm.addEventListener('submit', async (e) => {
  // STOP DEFAULT SUBMITTING BEHAVIOUR
  e.preventDefault();

  // GET FORM DATA AS AN OBJECT
  const formData = new FormData(editForm);
  const data = Object.fromEntries(formData.entries());

  // SET STATUS TO EITHER 1 OR 0
  data.Status = data.Status ? 1 : 0;

  // GET GLOBAL FACULTYID
  data.FacultyId = globalFacultyId;

  //RESET GLOBAL FACULTYID
  globalFacultyId = undefined;

  // VALIDATE NAME, UNIQUEiD AND CODE
  const validate = new Validate
  validate.length(data.Name, 3, 50, 'Name');
  validate.length(data.UniqueId, 3, 10, 'UniqueId');
  validate.length(data.Code, 2, 10, 'Code');

  // CHECK FOR ERROR BEFORE PUTING
  if (validate._errors.length > 0) {
    return alert(validate._errors[0])
  }

  try {
    // MAKE PUT REQUEST
    const result = await axios.put(`${BASE_URL}/api/v1/faculties`, data)
    console.log(result)

    // GET INDEX OF FACULTY CHANGED
    const index = FACULTIES.findIndex(faculty => faculty.FacultyId === data.FacultyId);

    // REPLACE THAT FACULTY WITH NEW DATA
    FACULTIES[index] = data;

    // RENDER TABLE WITH UPDATED FACULTY
    renderTable()

    // HIDE THE MODAL
    $(editModal).modal('hide')
  } catch (err) {
    console.log(err);
  }

}); 
