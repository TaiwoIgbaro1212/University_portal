const db = require("./departmentDB");

class Department {
  async getAllDepartments(req, res) {
    try {
      const retVal = await db.getAllDepartments();
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }


  async getDepartments(req, res) {
    try {
      const { FacultyId, Status, Name } = req.body;
      const retVal = await db.getDepartments(FacultyId, Status, Name);
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async getDepartment(req, res) {
    try {
      const deptId = req.params.id;
      const retVal = await db.getDepartment(deptId);
      if (retVal == null) {
        return res.status(400).json({
          Error:
            db.getError() === null ? "DB Response Was Null" : db.getError(),
        });
      }
      res.status(200).send(retVal);
    } catch (error) {
      return res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async addDepartment(req, res) {
    try {
      const {
        Name,
        FacultyId,
        UniqueId,
        Code,
        Status,
      } = req.body;
      //Validate Api here
      if (!Name || Name.length < 3) {
        return res.status(400).json({ Error: "Invalid/Empty Department Name" });
      }
      if (!FacultyId || FacultyId < 1) {
        return res.status(400).json({ Error: "Invalid Faculty Id" });
      }
      if (!UniqueId || UniqueId.length < 3) {
        return res.status(400).json({ Error: "Invalid Unique Id" });
      }
      if (!Code || Code.length < 2) {
        return res.status(400).json({ Error: "Invalid Code" });
      }
      if (Status < 0) {
        return res.status(400).json({ Error: "Invalid Status" });
      }
      const retvalue = await db.addDepartment({ Name, FacultyId, UniqueId, Code, Status });
      if (retvalue == null) {
        return res.status(400).json({ Error: db.getError() || "DB Response Was Null" });
      }

      res.status(200).json({ IsSuccessFul: true, body: retvalue });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  removeDepartment = async (req, res) => {
    try {
      const { departmentId } = req.params;
      if (departmentId == 0) {
        res.status(400).json({ Error: "Please input a valid department Id" });
      } else {
        console.log(departmentId);
        await db.removeDepartment(departmentId);
        res.status(200).json({ IsSuccessFul: true });
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  editDepartment = async (req, res) => {
    try {
      const department = { ...req.body };

      if (department.DepartmentId < 1) {
        return res.status(400).json({ Error: "Please input a valid department Id" });
      }
      const validate = this.validate(department);
      if (validate !== null) {
        return res.status(400).json({ Error: validate });
      }
      else {
        await db.editDepartment(department);
        res.status(200).json({ IsSuccessFul: true });
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  /**
     * 
     * @param {{
     * DepartmentId: number,
     * Name: string,
     * UniqueId: string,
     * Code: string,
     * Status: number
     * }} department 
     * @returns 
     */
  validate = (department) => {
    if (!department) return "Input Department Data";
    if (!department.Name || department.Name === "" || department.Name.length < 3) {
      return "Invalid/Empty department name";
    }
    if (!department.UniqueId || department.UniqueId == "") {
      console.log(department.UniqueId);
      return "Invalid/Missing UniqueId";
    }
    if (!department.Code || department.Code === "") {
      return "Invalid/Missing code";
    }
    if (department.Status < 0) {
      return "Invalid/Missing status";
    }
    return null;

  }
}

module.exports = new Department;
