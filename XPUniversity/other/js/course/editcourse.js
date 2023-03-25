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

// GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
// Suppose the URL is http://example.com?param=value1&param2=value2

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
    statusInput.value = data.Status;
    // console.log(data.getCourseById);
}
document.addEventListener('DOMContentLoaded', getCourseById);



// SUBMIT FORM TO EDIT THE DB
editingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // GET INPUT TO EDIT
    const departmentIdInput = document.querySelector('#departmentIdInput');
    const nameInput = document.querySelector('#nameInput');
    const codeInput = document.querySelector('#codeInput');
    const uniqueIdInput = document.querySelector('#uniqueIdInput');
    const unitsInput = document.querySelector('#unitsInput');
    const courseLevelInput = document.querySelector('#courseLevelInput');
    const courseSemesterInput = document.querySelector('#courseSemesterInput');
    const statusInput = document.querySelector('#statusInput');

    // INITIALIZE OUR VALIDATOR FUNCTION
    const validate = new Validate();

    // OBEJCT TO SEND TO DB
    const submitForm = {
        "CourseId": Number(courseIdInput.value),
        "DepartmentId": Number(departmentIdInput.value),
        "Name": nameInput.value,
        "Code": codeInput.value,
        "UniqueId": uniqueIdInput.value,
        "Units": Number(unitsInput.value),
        "CourseLevel": Number(courseLevelInput.value),
        "CourseSemester": Number(courseSemesterInput.value),
        "Status": Number(statusInput.value)
    }
    console.log(submitForm);

    validate.length(submitForm.Name, 3, 50, 'Name');
    validate.length(submitForm.Code, 3, 50, 'Code');
    validate.length(submitForm.UniqueId, 3, 10, 'UniqueId');
    validate.length(submitForm.Units, 3, 10, 'Units');
    validate.length(submitForm.CourseLevel, 2, 10, 'CourseLevel');
    validate.length(submitForm.CourseSemester, 2, 10, 'CourseSemester');
    // validate.length(submitForm.Code, 3, 10, 'Code');

    // CHECK FOR ERROR BEFORE PUTING
    if (validate._errors.length > 0) {
        alert(validate._errors[0])
    } else {
        // Make put request
        axios.put('http://192.168.17.220:8097/api/v1/courses', submitForm).then((result) => {
            console.log(result);
            window.location.href = 'http://localhost:5500/XPUniversity/other/html/course/course.html';
        }).catch((err) => {
            console.log(err);
        });
    }

}); 