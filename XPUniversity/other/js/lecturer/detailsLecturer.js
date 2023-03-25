// GET ALL OUR INPUTS READY AHEAD OF TIME 
const facultyIdInput = document.querySelector('#facultyIdInput');
const firstNameInput = document.querySelector('#firstNameInput');
const surnameInput = document.querySelector('#surnameInput');
const otherNameInput = document.querySelector('#otherNameInput');
const staffIdInput = document.querySelector('#staffIdInput');
const codeInput = document.querySelector('#codeInput');
const statusInput = document.querySelector('#statusInput');
const editingForm = document.querySelector('#editingForm');


// GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
lecturerIdInput.value = paramValue;


// Get information from the id parameter
const getDepartmentById = async () => {
    const dataObj = await axios.get(`http://192.168.17.220:8097/api/v1/lecturers/${lecturerIdInput.value}`)
    const data = await dataObj.data
    //  console.log(data.UniqueId);
    firstNameInput.value = data.FirstName;
    surnameInput.value = data.Surname;
    otherNameInput.value = data.OtherName;
    staffIdInput.value = data.Staff;
    codeInput.value = data.Code;
    statusInput.value = data.Status == 1 ? 'Active' : 'Inactive';
}



document.addEventListener('DOMContentLoaded', getDepartmentById);
