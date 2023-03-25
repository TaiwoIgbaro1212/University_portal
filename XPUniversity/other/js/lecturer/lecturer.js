const addLecturerForm = document.getElementById('addLecturerForm');


const populate = async () => {
  try {
    const table = document.getElementById('table-body');
    const response = await axios.get('http://192.168.17.220:8097/api/v1/lecturers');
    const data = response.data;

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
          <a href="../../html/lecturer/editlecturer.html?id=${lecturer.LecturerId}" class="btn btn-primary">Edit</a>
          <button class="btn btn-danger"  onclick="deletelecturer(${lecturer.LecturerId})">Delete</button>
          <a href="../../html/lecturer/detaillecturer.html?id=${lecturer.LecturerId}" class="btn btn-success">Details</a>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (error) {
    console.log(error);
  }

}


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



