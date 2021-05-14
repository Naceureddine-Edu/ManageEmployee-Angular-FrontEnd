import { Component, OnInit } from '@angular/core';
import { Employee } from "./_models/employee";
import { EmployeeService } from "./_services/employee.service";
import { HttpErrorResponse } from "@angular/common/http";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  employees: Employee[];
  editEmployee: Employee;
  deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
  this.getEmployees();
  }

  /** Methode Qui Permet De Recuperer La Liste Des Employees A Partir De L'API Backend */
  public getEmployees() : void {

    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  /**  Methode Qui Permet D'ouvrir Un Modal Bootstrap Ou Une Fenetre Qui Selon Le Paramettre Mode Permet De :
   * [ Ajouter, Modifer, Supprimer ] Un Employee  */
  public onOpenModal(employee: Employee, mode: string) : void {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
          button.type = 'button';
          button.style.display = 'none';
          button.setAttribute('data-toggle', 'modal');

          if(mode === 'add') {
            button.setAttribute('data-target', '#addEmployeeModal')
          }
          if(mode === 'edit') {
            this.editEmployee = employee;
            button.setAttribute('data-target', '#updateEmployeeModal');
          }
          if(mode === 'delete') {
            this.deleteEmployee = employee;
            button.setAttribute('data-target', '#deleteEmployeeModal');
          }
          container.appendChild(button);
          button.click();
  }

  public onAddEmployee(addForm: NgForm) : void {

    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response : Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
    }, (error: HttpErrorResponse) => {
        alert(error.message)
        console.log(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee) : void {

    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error:HttpErrorResponse)=> {
        alert(error.message);
        console.log(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number) : void {
      this.employeeService.deleteEmployee(employeeId).subscribe(
        (response: void) => {
          this.getEmployees();
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      );
  }

  public searchEmployees(key: string) : void {
    console.log(key);
    const results: Employee[] = [];
    for(const employee of this.employees)
    {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
         employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
         employee.phoneNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
         employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 )  {

        results.push(employee);
      }
        this.employees = results;
      if(results.length === 0 || !key)
      {
        this.getEmployees();
      }
    }
  }
}
