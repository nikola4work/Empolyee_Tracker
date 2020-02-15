selectAllDepts = () => {
    return 'SELECT * FROM ??'
};

selectAllRoles = () => {
    return `
    SELECT 
    A.??, 
    A.??,
    A.??,
    B.?? as 'department'

    FROM ?? A
    LEFT JOIN ?? B on A.?? = B.??
    `
}

selectAllRawRoles = () => {
    return `
    SELECT * from ??
    `
}

selectAllEmployees = () => {
    return `
    SELECT 
    A.??,
    concat(A.??, ' ', A.??) as ??,
    B.??,
    C.?? as 'department',
    B.??,
    concat(D.??, ' ', D.??) as manager
   
    FROM ?? A 
    LEFT JOIN ?? B on A.?? = B.??
    LEFT JOIN ?? C on B.?? = C.??
    LEFT JOIN ?? D on A.manager_id = D.id`
}

insertDepartment = (dept) => {
    return `INSERT INTO emptracker_db.department SET name = '${dept}'`
}

insertRole = (title, salary, department) => {
    return `
    INSERT INTO emptracker_db.role (title, salary, department_id)
    SELECT 
    '${title}',
    ${salary},
    A.id
    from emptracker_db.department A
    WHERE A.name = '${department}'
    `
}

insertEmployee = (firstName, lastName, roleTitle) => {
    return `
    INSERT INTO emptracker_db.employee (first_name, last_name, role_id)
	Select
	'${firstName}', 
	'${lastName}', 
	A.id
	FROM emptracker_db.role A
	WHERE A.title = '${roleTitle}';

    `
}

updateEmpManager = (managerId, empId) => {
    return `
    UPDATE emptracker_db.employee
    SET manager_id = ${managerId}
    WHERE id = ${empId}
    `
};

updateEmpRole = (roleTitle, empName) => {
    return `
    Update emptracker_db.employee 
    SET role_id = (Select id from emptracker_db.role where title = '${roleTitle}')
    Where CONCAT(first_name, ' ', last_name) = '${empName}'
    `
}



deleteEmployee = (empName) => {
    return `
    DELETE from emptracker_db.employee where CONCAT(first_name, ' ', last_name) = '${empName}'
    `
}


module.exports = { selectAllDepts, selectAllRoles, selectAllEmployees, insertDepartment, insertRole,
     insertEmployee, updateEmpManager, selectAllRawRoles, updateEmpRole, deleteEmployee };

