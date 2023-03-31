const addCourseOfStudyForm = document.getElementById('addCourseOfStudyForm');
const BASE_URL = 'http://192.168.17.220:8097';
let departments = [];
let coursesOfStudy = [];
let globalCourseOfStudy;


const renderTable = () => {
  const table = document.getElementById('table-body');
  coursesOfStudy.forEach((courseOfStudy, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${index + 1}</td>
        <td>${courseOfStudy.DepartmentId}</td>
        <td>${courseOfStudy.Name}</td>
        <td>${courseOfStudy.ShortName}</td>
        <td>${courseOfStudy.UniqueId}</td>
        <td>${courseOfStudy.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
    <td>
        <button 
      onclick="handleEditClick(${courseOfStudy.CourseOfStudyId})" 
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#editModal">Edit</button>

      <button 
      onclick="handleDetailClick(${courseOfStudy.CourseOfStudyId})" 
      class="btn btn-success"
      data-toggle="modal"
      data-target="#detailsModal">Details</button>
      
      <button class="btn btn-danger"  onclick="deletecourseOfStudy(${courseOfStudy.CourseOfStudyId})">Delete</button>
        </td>`;
        table.appendChild(row);
  });
};

const generateSelectOptions = () => {
  const selects = document.querySelectorAll('.departmentSelect');
  // console.log(faculties)
  selects.forEach(select => {
    departments.forEach(courseOfStudy => {
      const op = document.createElement('option')
      op.value = courseOfStudy.CourseOfStudyId
      op.innerText = courseOfStudy.Name
      select.appendChild(op)
    })
  })
}

const populate = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/coursesOfStudy/`);
    const data = response.data;
    coursesOfStudy = data

    const response2 = await axios.get(`${BASE_URL}/api/v1/departments`);
    const data2 = response2.data;
    departments = data2

    renderTable()
    generateSelectOptions()
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', populate);

// const populate = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/api/v1/coursesOfStudy`);
//     const data = response.data;

//     data.forEach((courseOfStudy, index) => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${index + 1}</td>
//         <td>${courseOfStudy.Name}</td>
//         <td>${courseOfStudy.ShortName}</td>
//         <td>${courseOfStudy.UniqueId}</td>
//         <td>${courseOfStudy.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
//         <td>
//           <a href="../../html/courseOfStudy/editcourseOfStudy.html?id=${courseOfStudy.CourseOfStudyId}" class="btn btn-primary">Edit</a>
//           <button class="btn btn-danger"  onclick="deletecourseOfStudy(${courseOfStudy.CourseOfStudyId})">Delete</button>
//           <a href="../../html/courseOfStudy/detailcourseOfStudy.html?id=${courseOfStudy.CourseOfStudyId}" class="btn btn-success">Details</a>
//         </td>
//       `;
//       table.appendChild(row);
//     });
//   } catch (error) {
//     console.log(error);
//   }

// }


// ================SEARCH AREA===============

// const searchModalForm = document.getElementById('searchModalForm');
// console.log(searchModalForm);
// const searchModal = document.getElementById("searchModal");

// const searchModalEvent = new MouseEvent('click', {

//   view: window,
//   bubbles: true,
//   cancelable: true
// });


// searchModalForm.addEventListener('submit', searchCourseOfStudyForm)


// async function searchCourseOfStudyForm(e) {
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

//   const fetchFilter = await axios.post(`${BASE_URL}/api/v1/coursesOfStudy/`, searchFormData);
//   const resultFilter = await fetchFilter
//   const filteredData = resultFilter.data

//   if (filteredData.length < 1) {
//     setTimeout(() => {
//       alert('No Such Data Exist')
//     }, 1000);
//   }

//   filteredData.forEach((courseOfStudy, index) => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//     <td>${index + 1}</td>
//         <td>${courseOfStudy.Name}</td>
//         <td>${courseOfStudy.ShortName}</td>
//         <td>${courseOfStudy.UniqueId}</td>
//     <td>${courseOfStudy.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
//     <td>
//       <a href="../../html/courseOfStudy/editcourseOfStudy.html?id=${courseOfStudy.CourseOfStudyId}" class="btn btn-primary">Edit</a>
//       <button class="btn btn-danger"  onclick="deletecourseOfStudy(${courseOfStudy.CourseOfStudyId})">Delete</button>
//       <a href="../../html/courseOfStudy/detailcourseOfStudy.html?id=${courseOfStudy.CourseOfStudyId}" class="btn btn-success">Details</a>
//     </td>
//     `;
//     table.appendChild(row);
//   });
// }
// ================END SEARCH AREA===============


function deletecourseOfStudy(id) {
  axios.delete(`${BASE_URL}/api/v1/coursesOfStudy/` + id).then((res) => {
    window.location.reload()
  }).catch((err) => {
    console.log(err);
  })
}

// async function deletecourseOfStudy(id) {
//   try {
//     const res = await axios.delete(`${BASE_URL}/api/v1/coursesOfStudy/${id}`)
//     console.log(res)
//   } catch (err) {
//     console.log(err.response.data.Error);
//     const container = document.querySelector('#table-wrapper');
//     const errdiv = document.createElement('div');
//     errdiv.classList = "alert alert-danger";
//     errdiv.innerText = err.response.data.Error;
//     container.prepend(errdiv);
//     setTimeout(() => errdiv.remove(), 3000);
//   }
// }


addCourseOfStudyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(addCourseOfStudyForm);
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
  validate.length(data.ShortName, 3, 50, 'ShortName');
  validate.length(data.UniqueId, 3, 10, 'UniqueId');
  validate.length(data.Award, 3, 100, 'Award');
  validate.length(data.Advisor, 3, 50, 'UniqueId');

  data.DepartmentId = Number(data.DepartmentId);
  data.RequiredCreditUnits = Number(data.RequiredCreditUnits);
  data.Duration = Number(data.Duration);
  // validate.length(data.Code, 3, 10, 'Code');

  if (validate.errors.length > 0) {
    alert(validate.errors[0]);
    return;
  } else {
    console.log(data);
    // Make post request
    axios.post(`${BASE_URL}/api/v1/coursesOfStudy/add`, data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})

// -------------EDIT SESSION --------------------------------

// GET ALL OUR INPUTS READY AHEAD OF TIME 
const departmentIdInput = document.querySelector('#departmentId');
// Get information from the id parameter
function handleEditClick(courseOfStudyId) {

  // get particular course Of study to edit
  const courseOfStudy = coursesOfStudy.find(courseOfStudy => courseOfStudy.CourseOfStudyId === courseOfStudyId);

  //fill in form values with department information
  populateEditForm(courseOfStudy);
  globalCourseOfStudy = courseOfStudyId;
}

const courseOfStudyIdInput = document.querySelector('#courseOfStudyId');
// Get information from the id parameter
function handleDetailClick(courseOfStudyId) {

  // get particular course Of study to edit
  const courseOfStudy = coursesOfStudy.find(courseOfStudy => courseOfStudy.CourseOfStudyId === courseOfStudyId);

  //fill in form values with department information
  populateEditForm(courseOfStudy);
  globalCourseOfStudy = courseOfStudyId;

  console.log(courseOfStudy)

  document.getElementById("cosName").innerHTML = `Course of Study Name: ${courseOfStudy.Name}`;
  document.getElementById("cosShortName").innerHTML = `Course of Study Short Name: ${courseOfStudy.ShortName}`;
  document.getElementById("cosuniqueId").innerHTML = `Course of Study Unique ID: ${courseOfStudy.UniqueId}`;
  document.getElementById("cosAward").innerHTML = `Course of Study Award: ${courseOfStudy.Award}`;
  document.getElementById("Duration").innerHTML = `Course of Duration: ${courseOfStudy.Duration}`;
  document.getElementById("cosrequiredCreditUnits").innerHTML = `Course of Required Credit Units: ${courseOfStudy.RequiredCreditUnits}`;
  document.getElementById("cosadvisor").innerHTML = `Course of Study Advisor: ${courseOfStudy.Advisor}`;
}

function populateEditForm(courseOfStudy) {
  const editForm = document.getElementById('editingForm')
  Array.from(editForm.elements).forEach((element) => {

    if (element.name === 'Status') {
      element.checked = courseOfStudy[element.name] === 1 ? true : false;
    }
    if (courseOfStudy.hasOwnProperty(element.name)) {
      element.value = typeof departments[element.name] === 'string' ? courseOfStudy[element.name].trim() : courseOfStudy[element.name];
    }
  })
}

// SUBMIT FORM TO EDIT THE DB
const editForm = document.querySelector('#editingForm');
editingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // GET FORM DATA AS AN OBJECT
  const formData = new FormData(editForm);
  const data = Object.fromEntries(formData.entries());

  // SET STATUS TO EITHER 1 OR 0
  data.Status = data.Status ? 1 : 0;

  // GET GLOBAL CourseOfStudyId
  data.CourseOfStudyId = globalCourseOfStudy;

  //RESET GLOBAL CourseOfStudyId
  globalCourseOfStudy = undefined;

  validate.isChosen(data.Name, 3, 50, 'Name');
  validate.length(data.ShortName, 3, 50, 'ShortName');
  validate.length(data.UniqueId, 3, 10, 'UniqueId');
  validate.length(data.Award, 3, 100, 'Award');
  validate.isNumber(data.Duration, "Duration");
  validate.mininteger(data.Duration, 1, "Duration");
  validate.isNumber(data.RequiredCreditUnits, "RequiredCreditUnits");
  validate.mininteger(data.RequiredCreditUnits, 1, "RequiredCreditUnits")


  data.Duration = Number(data.Duration);
  data.RequiredCreditUnits = Number(data.RequiredCreditUnits);
  
  // CHECK FOR ERROR BEFORE PUTING
  if (validate._errors.length > 0) {
    alert(validate._errors[0])
  } else {
    // Make put request
    axios.put(`${BASE_URL}/api/v1/coursesOfStudy/`, data).then((result) => {
      console.log(result);


      const index = departments.findIndex(courseOfStudy => courseOfStudy.CourseOfStudyId === data.CourseOfStudyId);
      departments[index] = data;
      renderTable()
      $(editModal).modal('hide')
    }).catch((err) => {
      console.log(err);
    });
  }
})