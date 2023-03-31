// GET ALL OUR INPUTS READY AHEAD OF TIME 
const lecturerIdInput = document.querySelector('#lecturerIdInput');
const departmentIdInput = document.querySelector('#departmentIdInput');
const nameInput = document.querySelector('#nameInput');
const shortNameInput = document.querySelector('#shortNameInput');
const uniqueIdInput = document.querySelector('#uniqueIdInput');
const awardInput = document.querySelector('#awardInput');
const durationInput = document.querySelector('#durationInput');
const requiredCreditUnitsInput = document.querySelector('#requiredCreditUnitsInput');
const advisorInput = document.querySelector('#advisorInput');
const statusInput = document.querySelector('#statusInput');
const detailForm = document.querySelector('#detailForm');


const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
courseOfStudyIdInput.value = paramValue;

// Get information from the id parameter
const getCourseOfStudyById = async () => {
    const dataObj = await axios.get(`http://192.168.17.220:8097/api/v1/coursesOfStudy/${courseOfStudyIdInput.value}`)
    const data = await dataObj.data
    nameInput.value = data.Name;
    departmentIdInput.value = data.DepartmentId;
    shortNameInput.value = data.ShortName;
    uniqueIdInput.value = data.UniqueId;
    awardInput.value = data.Award;
    durationInput.value = data.Duration;
    requiredCreditUnitsInput.value = data.RequiredCreditUnits;
    advisorInput.value = data.Advisor;
    statusInput.value = data.Status == 1 ? 'Active' : 'Inactive';
}
document.addEventListener('DOMContentLoaded', getCourseOfStudyById);