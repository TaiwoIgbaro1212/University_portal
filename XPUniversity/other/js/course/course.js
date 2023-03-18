const addCourseForm = document.getElementById('addCourseForm');
const table = document.getElementById('table-body');
let courses = [];
let departments = []


const renderTable = () => {
    courses.forEach((course, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${course.Name}</td>
      <td>${course.UniqueId}</td>
      <td>${course.CourseLevel}</td>
      <td>${course.CourseSemester}</td>
      <td>${course.Units}</td>
      <td>${course.Code}</td>
      <td>${course.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
        <a href="../../html/course/editcourse.html?id=${course.courseId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deletecourse(${course.courseId})">Delete</button>
        <a href="../../html/course/detailcourse.html?id=${course.courseId}" class="btn btn-success">Details</a>
      </td>
    `;
    table.appendChild(row);
  });
}


const generateSelectOptions = () => {
  const selects = document.querySelectorAll('.departmentSelect');
  console.log(departments)
  console.log(selects);
  selects.forEach(select => {
    departments.forEach(department => {
      const op = document.createElement('option')
      op.value = department.DepartmentId
      op.innerText = department.Name
      select.appendChild(op)
    })
  })
}
const populate = async () => {
  try {
    // const table = document.getElementById('table-body');
    const response = await axios.get('http://localhost:8097/api/v1/courses');
    const data = response.data;
    courses = data

    const response2 = await axios.get('http://localhost:8097/api/v1/departments');
    const data2 = response2.data;
    departments = data2

    renderTable()
    generateSelectOptions()
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


searchModalForm.addEventListener('submit', searchCourseForm)

async function searchCourseForm(e) {
  e.preventDefault()
  table.innerHTML = null

  const formData = new FormData(searchModalForm);
  const searchFormData = Object.fromEntries(formData.entries());
  if (searchFormData.Status) {
    searchFormData.Status = 1;
  } else {
    searchFormData.Status = -1;
  }

  console.log(searchFormData);

  const fetchFilter = await axios.post('http://localhost:8097/api/v1/courses/', searchFormData);
  const resultFilter = await fetchFilter
  const filteredData = resultFilter.data

  if (filteredData.length < 1) {
    setTimeout(() => {
        alert('No Such Data Exist')
    }, 1000);
  }

  filteredData.forEach((course, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${index + 1}</td>
    <td>${course.Name}</td>
      <td>${course.UniqueId}</td>
      <td>${course.CourseLevel}</td>
      <td>${course.CourseSemester}</td>
      <td>${course.Units}</td>
      <td>${course.Code}</td>
      <td>${course.Status == 1 ? '<div class="text-success">Active</div>' : '<div class="text-danger">Inactive<div>'}</td>
      <td>
        <a href="../../html/course/editcourse.html?id=${course.courseId}" class="btn btn-primary">Edit</a>
        <button class="btn btn-danger"  onclick="deletecourse(${course.courseId})">Delete</button>
        <a href="../../html/course/detailcourse.html?id=${course.courseId}" class="btn btn-success">Details</a>
      </td>
    `;
    table.appendChild(row);
  });
}

function deletecourse(id) {
  console.log(id);
  axios.delete('http://localhost:8097/api/v1/courses/' + id).then((res) => {
    window.location.reload()
  }).catch((err) => {
    console.log(err);
  })
}

addCourseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(addCourseForm);
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
  validate.isNumber(data.CourseLevel, "CourseLevel");
  validate.mininteger(data.CourseLevel, 1, "CourseLevel")
  validate.isNumber(data.CourseSemester, "CourseSemester");
  validate.mininteger(data.CourseSemester, 1, "CourseSemester");
  validate.isNumber(data.Units, "Units");
  validate.mininteger(data.Units, 1, "Units");
  validate.length(data.Code, 3, 10, 'Code');

  data.CourseSemester = Number(data.CourseSemester);
  data.CourseLevel = Number(data.CourseLevel);
  data.Units = Number(data.Units);

  if (validate.errors.length > 0) {
    alert(validate.errors[0]);
    return;
  } else {
    console.log(data);
    // Make post request
    axios.post('http://localhost:8097/api/v1/courses/add', data).then((result) => {
      console.log(result);
      window.location.reload()
    }).catch((err) => {
      console.log(err);
    });
  }

})



