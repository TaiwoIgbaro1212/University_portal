const addFacultyForm = document.getElementById('addFacultyForm');
const table = document.getElementById('table-body');


const populate = async () => {
  try {
    const response = await axios.get('http://localhost:8097/api/v1/faculties');
    const data = response.data;

    data.forEach((faculty, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${faculty.Name}</td>
        <td>${faculty.UniqueId}</td>
        <td>${faculty.Code}</td>
        <td>${faculty.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
        <td>
          <a href="../../html/faculty/editfaculty.html?id=${faculty.FacultyId}" class="btn btn-primary">Edit</a>
          <button class="btn btn-danger"  onclick="deletefaculty(${faculty.FacultyId})">Delete</button>
          <a href="../../html/faculty/detailfaculty.html?id=${faculty.FacultyId}" class="btn btn-success">Details</a>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (error) {
    console.log(error);
  }

}
document.addEventListener('DOMContentLoaded', populate);


// SEARCH AREA

const searchModalForm = document.querySelector('#searchModalForm');
const searchModal = document.getElementById("searchModal");
const searchModalEvent = new MouseEvent('click', {

  view: window,
  bubbles: true,
  cancelable: true
});


searchModalForm.addEventListener('submit', searchFacultyForm)

async function searchFacultyForm(e) {
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

  const fetchFilter = await axios.post('http://localhost:8097/api/v1/faculties/', searchFormData);
  const resultFilter = await fetchFilter
  const filteredData = resultFilter.data

  if (filteredData.length < 1) {
    setTimeout(() => {
        alert('No Such Data Exist')
    }, 1000);
  }

  filteredData.forEach((faculty, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${faculty.Name}</td>
      <td>${faculty.UniqueId}</td>
      <td>${faculty.Code}</td>
      <td>${faculty.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
        <a href="../../html/faculty/editfaculty.html?id=${faculty.FacultyId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deletefaculty(${faculty.FacultyId})">Delete</button>
        <a href="../../html/faculty/detailfaculty.html?id=${faculty.FacultyId}" class="btn btn-success">Details</a>
      </td>
    `;
    table.appendChild(row);
  });
}

function deletefaculty(id){
  axios.delete('http://localhost:8097/api/v1/faculties/'+id).then((res) => {
    window.location.reload()
  }).catch((err) => {
    console.log(err);
  })
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
    axios.post('http://localhost:8097/api/v1/faculties/add',data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})



