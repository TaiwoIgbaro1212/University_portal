 // GET ALL OUR INPUTS READY AHEAD OF TIME 
 const facultyIdInput = document.querySelector('#facultyId');
 const nameInput = document.querySelector('#nameInput');
 const uniqueIdInput = document.querySelector('#uniqueIdInput');
 const codeInput = document.querySelector('#codeInput');
 const statusInput = document.querySelector('#statusInput');
 const editingForm = document.querySelector('#editingForm');
 
 
 // GET PARAMETERS OR ID FROM THE CURRENT FACULTY TO EDITING FORM
 // Suppose the URL is http://example.com?param=value1&param2=value2
 
 const params = new URLSearchParams(window.location.search);
 // Get the value of the 'id' parameter
 const paramValue = params.get('id');
 facultyIdInput.value = paramValue;
 
 
 // Get information from the id parameter
 const getDepartmentById = async () => {
     const dataObj = await axios.get(`http://localhost:8097/api/v1/departments/${courseOfStudyIdInput.value}`)
     const data = await dataObj.data
     console.log(data.UniqueId);
     nameInput.value  = data.Name;
     uniqueIdInput.value  = data.UniqueId;;
     codeInput.value  = data.Code;
     statusInput.value  = data.Status == 1 ? 'Active' : 'Inactive';
 } 
 
 
 
 document.addEventListener('DOMContentLoaded', getDepartmentById);
 