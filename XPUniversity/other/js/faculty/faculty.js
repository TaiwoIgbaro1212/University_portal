let FACULTIES = [];
const BASE_URL = "http://192.168.17.220:8097";
let globalFacultyId;
const table = document.getElementById("table-body");
let show_status;

const addFacultyForm = document.getElementById("addFacultyForm");

const renderTable = () => {
  // console.log('render table called');
  
  const filteredData = FACULTIES;
  const tableContent = filteredData
    .map((faculty, index) => {
      return `
      <tr>
      <td>${index + 1}</td>
      <td>${faculty.Name}</td>
      <td>${faculty.UniqueId}</td>
      <td>${faculty.Code}</td>
      <td>${
        faculty.Status == 1
          ? '<div class="text-success">Active</div>'
          : '<div class="text-danger">Inactive<div>'
      }</td>
      <td>
        <button 
          onclick="handleEditClick(${faculty.FacultyId})" 
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#editModal">Edit</button>
        <button class="btn btn-danger"  onclick="deletefaculty(${
          faculty.FacultyId
        })">Delete</button>
      </td>
      </tr>
    `;
    })
    .join("");
  table.innerHTML = tableContent;
};
const populate = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/faculties`);
    FACULTIES = response.data;
    filteredData = response.data;
    renderTable();
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", populate);

async function deletefaculty(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/api/v1/faculties/${id}`);
    console.log(res);
    window.location.reload();
  } catch (err) {
    console.log(err.response.data.Error);
    const container = document.querySelector("#table-wrapper");
    const errdiv = document.createElement("div");
    errdiv.classList = "alert alert-danger";
    errdiv.innerText = err.response.data.Error;
    container.prepend(errdiv);
    setTimeout(() => errdiv.remove(), 3000);
  }
}

addFacultyForm.addEventListener("submit", (e) => {
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
  validate.length(data.Name, 3, 50, "Name");
  validate.length(data.UniqueId, 3, 10, "UniqueId");
  validate.length(data.Code, 3, 10, "Code");

  if (validate.errors.length > 0) {
    alert(validate.errors[0]);
    return;
  } else {
    console.log(data);
    // Make post request
    axios
      .post(`${BASE_URL}/api/v1/faculties/add`, data)
      .then((result) => {
        console.log(result);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// ===============EDIT FORM=========================
// Get information from the id parameter
function handleEditClick(facultyId) {
  // get particular faculty to edit
  const faculty = FACULTIES.find((faculty) => faculty.FacultyId === facultyId);

  // fill in form values with faculty information
  populateEditForm(faculty);

  globalFacultyId = facultyId;
}

function populateEditForm(faculty) {
  const editForm = document.getElementById("editingForm");
  Array.from(editForm.elements).forEach((element) => {
    if (element.name === "Status") {
      element.checked = faculty.Status === 1 ? true : false;
      return;
    }
    element.value = faculty.hasOwnProperty(element.name)
      ? faculty[element.name].trim()
      : "";
  });
}

// GET FORM AND ADD SUBMIT EVENT LISTENER
const editForm = document.querySelector("#editingForm");
editingForm.addEventListener("submit", async (e) => {
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
  const validate = new Validate();
  validate.length(data.Name, 3, 50, "Name");
  validate.length(data.UniqueId, 3, 10, "UniqueId");
  validate.length(data.Code, 2, 10, "Code");

  // CHECK FOR ERROR BEFORE PUTING
  if (validate._errors.length > 0) {
    return alert(validate._errors[0]);
  }

  try {
    // MAKE PUT REQUEST
    const result = await axios.put(`${BASE_URL}/api/v1/faculties`, data);
    console.log(result);

    // GET INDEX OF FACULTY CHANGED
    const index = FACULTIES.findIndex(
      (faculty) => faculty.FacultyId === data.FacultyId
    );

    // REPLACE THAT FACULTY WITH NEW DATA
    FACULTIES[index] = data;

    // RENDER TABLE WITH UPDATED FACULTY
    renderTable();

    // HIDE THE MODAL
    $(editModal).modal("hide");
  } catch (err) {
    console.log(err);
  }
});

// ==========SEARCH=========
{
  const items = document.querySelectorAll("[data-check]");
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      // console.log(document.querySelector("input[type=radio]:checked").value);
    });
  });
}

const activeStatus = () => {
  show_status = document.querySelector("input[type=radio]:checked").value;
  console.log(document.querySelector("input[type=radio]:checked").value);
}

const searchFilter = document.getElementById("searchFilter");
searchFilter.addEventListener("submit", async (e)=>{
  e.preventDefault();
  table.innerHTML = "";
  let searchObj =  {
    Name: searchFilter.Name.value,
    Status: show_status
  }
  const result = await axios.post(`${BASE_URL}/api/v1/faculties`, searchObj);
      const tableContent = result.data
        .map((faculty, index) => {
          return `
      <tr>
      <td>${index + 1}</td>
      <td>${faculty.Name}</td>
      <td>${faculty.UniqueId}</td>
      <td>${faculty.Code}</td>
      <td>${
        faculty.Status == 1
          ? '<div class="text-success">Active</div>'
          : '<div class="text-danger">Inactive<div>'
      }</td>
      <td>
        <button 
          onclick="handleEditClick(${faculty.FacultyId})" 
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#editModal">Edit</button>
        <button class="btn btn-danger"  onclick="deletefaculty(${
          faculty.FacultyId
        })">Delete</button>
      </td>
      </tr>
    `;
        })
        .join("");
      table.innerHTML = tableContent;
  });
