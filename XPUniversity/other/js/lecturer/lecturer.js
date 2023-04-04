const addLecturerForm = document.getElementById('addLecturerForm');
const BASE_URL = 'http://192.168.17.220:8097';
let lecturers = [];
let departments = [];
let globalLecturerId;

const populate = async () => {
  try {
    const response2 = await axios.get(`${BASE_URL}/api/v1/departments`);
    const data2 = response2.data;
    departments = data2;
    const table = document.getElementById('table-body');
    const response = await axios.get('http://192.168.17.220:8097/api/v1/lecturers');
    const data = response.data;
    lecturers = data;
    generateSelectOptions();

    data.forEach((lecturer, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${lecturer.FirstName}</td>
        <td>${lecturer.Surname}</td>
        <td>${lecturer.OtherName}</td>
        <td>${lecturer.StaffId}</td>
        <td>${lecturer.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
        <td>
        <button 
        onclick="handleEditClick(${lecturer.LecturerId})" 
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#editModal">Edit</button>
  
        <button 
      onclick="handleDetailClick(${lecturer.LecturerId})" 
      class="btn btn-success"
      data-toggle="modal"
      data-target="#detailsModal">Details</button>
        
        <button class="btn btn-danger"  onclick="deletelecturer(${lecturer.LecturerId})">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (error) {
    console.log(error);
  }

}

const generateSelectOptions = () => {
  const selects = document.querySelectorAll(".departmentSelect");
  selects.forEach((select) => {
    departments.forEach((department) => {
      const op = document.createElement("option");
      op.value = department.DepartmentId;
      op.innerText = department.Name;
      select.appendChild(op);
    });
  });
};

document.addEventListener('DOMContentLoaded', populate);

function deletelecturer(id){
  axios.delete('http://192.168.17.220:8097/api/v1/lecturers/'+id).then((res) => {
    window.location.reload()
  }).catch((err) => {
    console.log(err);
  })
}


addLecturerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(addLecturerForm);
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  // validate checkbox
  if (data.Status) {
    data.Status = 1;
  } else {
    data.Status = 0;
  }
  console.log(data);

  const validate = new Validate();
  validate.length(data.FirstName, 3, 50, 'Name');
  validate.length(data.Surname, 3, 50, 'Name');
  validate.length(data.StaffId, 3, 10, 'StaffId');

  if (validate.errors.length > 0) {
    alert(validate.errors[0]);
    return;
  } else {
    console.log(data);
    // Make post request
    axios.post('http://192.168.17.220:8097/api/v1/lecturers/add',data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})

//      EDIT 

const departmentIdInput = document.querySelector('#departmentId');

function handleEditClick(lecturerId) {
  
  const lecturer = lecturers.find(lecturer =>lecturer.LecturerId === lecturerId);
  populateEditForm(lecturer);
  globalLecturerId = lecturerId;
}

const lecturerInput = document.querySelector('lecturerId');
// Get information from the id parameter
function handleDetailClick(lecturerId) {
  // get particular course Of study to edit
  const lecturer = lecturers.find(lecturer => lecturer.LecturerId === lecturerId);

  //fill in form values with department information
  populateEditForm(lecturer);
  globalLecturerId = lecturerId;

  document.getElementById("lecfirstName").innerHTML = `Lecturer First Name: ${lecturer.FirstName}`;
  document.getElementById("lecsurname").innerHTML = `Lecturer Surname: ${lecturer.Surname}`;
  document.getElementById("lecotherName").innerHTML = `Lecturer Other Name: ${lecturer.OtherNames || 'N/A'}`;
  document.getElementById("lecstaffId").innerHTML = `Staff ID: ${lecturer.StaffId}`;
}


function populateEditForm(lecturer) {
  const editForm = document.getElementById('editingForm');
  document.getElementById("departmentId").value = lecturer.DepartmentId;
  document.getElementById("firstNameInput").value = lecturer.FirstName;
  document.getElementById("surnameInput").value = lecturer.Surname;
  document.getElementById("staffIdInput").value = lecturer.StaffId
  // Array.from(editForm.elements).forEach((element) => {
  //   if (element.name === 'Status') {
  //     element.checked = lecturer[element.name] === 1 ? true : false;
  //   }
  //   if (lecturer.hasOwnProperty(element.name)) {
  //     element.value = typeof departments[element.name] === 'string' ? lecturer[element.name].trim() : lecturer[element.name];
  //   }
  // })
}

const editForm = document.querySelector('#editingForm');
editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // GET FORM DATA AS AN OBJECT
  const formData = new FormData(editForm);
  const data = Object.fromEntries(formData.entries());

  // SET STATUS TO EITHER 1 OR 0
  data.Status = data.Status ? 1 : 0;

  // GET GLOBAL LecturerId
  data.LecturerId = globalLecturerId;

  //RESET GLOBAL LecturerId
  globalLecturerId = undefined;

  console.log(data)
  validate.isChosen(data.FacultyId, "Faculty Name")
  validate.length(data.FirstName, 3, 50, "First Name");
  validate.length(data.Surname, 3, 50, "Surname");
  validate.length(data.OtherName, 3, 10, "Other Name");
  validate.length(data.StaffId, 3, 10, 'StaffId');
  // validate.length(data.Code, 3, 10, 'Code');


  // CHECK FOR ERROR BEFORE PUTING
  if (validate._errors.length > 0) {
    alert(validate._errors[0])
  } else {
    // Make put request
    axios.put(`${BASE_URL}/api/v1/lecturers/`, data).then((result) => {
      console.log(result);


      const index = lecturers.findIndex(lecturer => lecturer.LecturerId === data.LecturerId);
      departments[index] = data;
      renderTable()
      $(editModal).modal('hide')
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }
});
