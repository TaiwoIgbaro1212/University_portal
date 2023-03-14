const addDepartmentForm = document.getElementById('addDepartmentForm');
let departments = [];
let faculties = []


const renderTable = () => {
  const table = document.getElementById('table-body');
  departments.forEach((department, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${department.Name}</td>
      <td>${department.UniqueId}</td>
      <td>${department.Code}</td>
      <td>${department.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
        <a href="../../html/department/editdepartment.html?id=${department.DepartmentId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deletedepartment(${department.DepartmentId})">Delete</button>
        <a href="../../html/department/detaildepartment.html?id=${department.DepartmentId}" class="btn btn-success">Details</a>
      </td>
    `;
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
    const response = await axios.get('http://localhost:8097/api/v1/departments');
    const data = response.data;
    departments = data

    const response2 = await axios.get('http://localhost:8097/api/v1/faculties');
    const data2 = response2.data;
    faculties = data2

    renderTable()
    generateSelectOptions()
  } catch (error) {
    console.log(error);
  }

}

document.addEventListener('DOMContentLoaded', populate);

function deletedepartment(id) {
  console.log(id);
  axios.delete('http://localhost:8097/api/v1/departments/' + id).then((res) => {
    // window.location.reload()
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
    axios.post('http://localhost:8097/api/v1/departments/add', data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})



