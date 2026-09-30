import { BadRequestException, Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { CreateStudentDto } from './createstudent.dto.js';

// Adatmodell
interface Student {
  name: string;
  age: number;
}


@Controller()
export class AppController {
  // Egyelőre memóriában tároljuk
  // Szerver újraindításkor elveszik!
  students: Student[] = [];

  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'My First NestJS App'
    }
  }

  @Get('newstudent')
  @Render('newstudent')
  newStudentForm() {
    return {
      students: this.students
    }
  }

  @Post('newstudent')
  @Render('newstudent')
  newStudent(@Body() body: CreateStudentDto) {
    // TODO: hibaüzenetek tömbösítése!
    // TODO: megfelelő státusz kód (most minden 200/201)
    // TODO: lehessen frissíteni az oldalt form újraküldés nélkül

    // Név létezzen
    if (!body.name) {
      //throw new BadRequestException("Érvénytelen név");
      return {
        error: 'Érvénytelen név',
        students: this.students,
        newStudent: body,
      }
    }
    // Életkor létezzen
    if (!body.age) {
      return {
        error: 'Nincs életkor',
        students: this.students,
        newStudent: body,
      }
    }

    const age = parseInt(body.age);
    // Életkor legyen pozitív szám
    if (!age || isNaN(age) || age < 1) {
      return {
        error: 'Érvénytelen életkor',
        students: this.students,
        newStudent: body,
      }
    }

    // Adattárolás, módosítás
    const student: Student = {
      name: body.name,
      age: parseInt(body.age),
    }
    this.students.push(student);

    // Megváltozott adatok átadása a view-nek
    return {
      students: this.students
    }
  }
}
