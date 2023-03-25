// GET ALL OUR INPUTS READY AHEAD OF TIME 
const lecturerIdInput = document.querySelector('#lecturerIdInput');
const departmentIdInput = document.querySelector('#departmentIdInput');
const nameInput = document.querySelector('#nameInput');
const codeInput = document.querySelector('#codeInput');
const uniqueIdInput = document.querySelector('#uniqueIdInput');
const unitsInput = document.querySelector('#unitsInput');
const courseLevelInput = document.querySelector('#courseLevelInput');
const courseSemesterInput = document.querySelector('#courseSemesterInput');
const statusInput = document.querySelector('#statusInput');
const editingForm = document.querySelector('#editingForm');


const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
courseIdInput.value = paramValue;

// Get information from the id parameter
const getCourseById = async () => {
    const dataObj = await axios.get(`http://192.168.17.220:8097/api/v1/courses/${courseIdInput.value}`)
    const data = await dataObj.data
    nameInput.value = data.Name;
    departmentIdInput.value = data.DepartmentId;
    codeInput.value = data.Code;
    uniqueIdInput.value = data.UniqueId;
    unitsInput.value = data.Units;
    courseLevelInput.value = data.CourseLevel;
    courseSemesterInput.value = data.CourseSemester;
    statusInput.value = data.Status == 1 ? 'Active' : 'Inactive';
}
document.addEventListener('DOMContentLoaded', getCourseById);