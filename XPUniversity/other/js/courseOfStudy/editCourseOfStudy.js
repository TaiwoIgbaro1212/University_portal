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

const editingForm = document.querySelector('#editingForm');

// GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

const params = new URLSearchParams(window.location.search);
// Get the value of the 'id' parameter
const paramValue = params.get('id');
courseOfStudyIdInput.value = paramValue;


// Get information from the id parameter
const getCourseOfStudyById = async () => {
    const dataObj = await axios.get(`http://localhost:8097/api/v1/coursesOfStudy/${courseOfStudyIdInput.value}`)
    const data = await dataObj.data
    nameInput.value = data.Name;
    departmentIdInput.value = data.DepartmentId;
    shortNameInput.value = data.ShortName;
    uniqueIdInput.value = data.UniqueId;
    awardInput.value = data.Award;
    durationInput.value = data.Duration;
    requiredCreditUnitsInput.value = data.RequiredCreditUnits;
    advisorInput.value = data.Advisor;
    statusInput.value = data.Status;
    // console.log(data.getCourseOfStudyById);
}
document.addEventListener('DOMContentLoaded', getCourseOfStudyById);



// SUBMIT FORM TO EDIT THE DB
editingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // GET INPUT TO EDIT
    const departmentIdInput = document.querySelector('#departmentIdInput');
    const nameInput = document.querySelector('#nameInput');
    const shortNameInput = document.querySelector('#shortNameInput');
    const uniqueIdInput = document.querySelector('#uniqueIdInput');
    const awardInput = document.querySelector('#awardInput');
    const durationInput = document.querySelector('#durationInput');
    const requiredCreditUnitsInput = document.querySelector('#requiredCreditUnitsInput');
    const advisorInput = document.querySelector('#advisorInput');
    const statusInput = document.querySelector('#statusInput');

    // INITIALIZE OUR VALIDATOR FUNCTION
    const validate = new Validate();

    // OBEJCT TO SEND TO DB
    const submitForm = {
        "CourseOfStudyId": Number(courseOfStudyIdInput.value),
        "DepartmentId": Number(departmentIdInput.value),
        "Name": nameInput.value,
        "ShortName": shortNameInput.value,
        "UniqueId": uniqueIdInput.value,
        "Award": awardInput.value,
        "Duration": Number(durationInput.value),
        "RequiredCreditUnits": Number(requiredCreditUnitsInput.value),
        "Advisor": advisorInput.value,
        "Status": Number(statusInput.value)
    }

    validate.length(submitForm.Name, 3, 50, 'Name');
    validate.length(submitForm.ShortName, 3, 50, 'ShortName');
    validate.length(submitForm.UniqueId, 3, 10, 'UniqueId');
    validate.length(submitForm.Award, 3, 100, 'Award');
    validate.length(submitForm.Duration, 2, 10, 'Duration');
    validate.length(submitForm.RequiredCreditUnits, 2, 10, 'RequiredCreditUnits');
    validate.length(submitForm.Advisor, 2, 10, 'Advisor');
    // validate.length(data.Code, 3, 10, 'Code');
    // validate.length(submitForm.Code, 3, 10, 'Code');

    // CHECK FOR ERROR BEFORE PUTING
    if (validate._errors.length > 0) {
        alert(validate._errors[0])
    } else {
        // Make put request
        axios.put('http://localhost:8097/api/v1/coursesOfStudy', submitForm).then((result) => {
            console.log(result);
            window.location.href = 'http://localhost:5500/XPUniversity/other/html/courseOfStudy/courseOfStudy.html';
        }).catch((err) => {
            console.log(err);
        });
    }

}); 