// GET ALL OUR INPUTS READY AHEAD OF TIME 
const lecturerIdInput = document.querySelector('#lecturerIdInput');
const departmentIdInput = document.querySelector('#departmentIdInput');
const surnameInput = document.querySelector('#surnameInput');
const firstNameInput = document.querySelector('#firstNameInput');
const otherNameInput = document.querySelector('#otherNameInput');
const staffIdInput = document.querySelector('#staffIdInput');
const statusInput = document.querySelector('#statusInput');

const editingForm = document.querySelector('#editingForm');

// GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
lecturerIdInput.value = paramValue;


// Get information from the id parameter
const getLecturerById = async () => {
    const dataObj = await axios.get(`http://192.168.17.220:8097/api/v1/lecturers/${lecturerIdInput.value}`)
    const data = await dataObj.data
    console.log(data.StaffIdInput);
    surnameInput.value  = data.Surname;
    departmentIdInput.value  = data.DepartmentId;
    firstNameInput.value  = data.FirstName;
    otherNameInput.value  = data.OtherName;
    staffIdInput.value  = data.StaffId;
    statusInput.value  = data.Status;
} 



document.addEventListener('DOMContentLoaded', getLecturerById);



// SUBMIT FORM TO EDIT THE DB
editingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // GET INPUT TO EDIT
    const departmentIdInput = document.querySelector('#departmentIdInput');
    const surnameInput = document.querySelector('#surnameInput');
    const firstNameInput = document.querySelector('#firstNameInput');
    const otherNameInput = document.querySelector('#otherNameInput');
    const staffIdInput = document.querySelector('#staffIdInput');
    const statusInput = document.querySelector('#statusInput');

    // INITIALIZE OUR VALIDATOR FUNCTION
    const validate = new Validate();

    // OBEJCT TO SEND TO DB
    const submitForm = {
        "LecturerId": Number(lecturerIdInput.value),
        "DepartmentId": Number(departmentIdInput.value),
        "Surname": surnameInput.value,
        "FirstName": firstNameInput.value,
        "OtherNames": otherNameInput.value,
        "StaffId": staffIdInput.value,
        "Status": Number(statusInput.value)
    }

    validate.length(submitForm.Surname, 3, 50, 'Surname');
    validate.length(submitForm.FirstName, 3, 50, 'FirstName');
    validate.length(submitForm.OtherNames, 3, 50, 'OtherName');
    validate.length(submitForm.StaffId, 3, 10, 'StaffId');
    // validate.length(submitForm.Code, 3, 10, 'Code');

    // CHECK FOR ERROR BEFORE PUTING
    if (validate._errors.length > 0) {
        alert(validate._errors[0])
    }else{
    // Make put request
    axios.put('http://192.168.17.220:8097/api/v1/lecturers', submitForm).then((result) => {
        console.log(result);
        window.location.href = 'http://localhost:5500/XPUniversity/other/html/lecturer/lecturer.html'
      }).catch((err) => {
        console.log(err);
      });
    }

}); 