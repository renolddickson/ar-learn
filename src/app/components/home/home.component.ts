import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  topic!:any;
  userSettings: any;
  uid:any;
  isLoading=false;
  points=0;
  @ViewChild('earth') earth!:ElementRef;
  @ViewChild('mech') mech!:ElementRef;
  @ViewChild('health') health!:ElementRef;
  @ViewChild('dialog') dialogBox!: TemplateRef<any>;
  questions = [
    {
      question: "How much of Earth's surface is covered by water?",
      answers: [
        { name: "A", value: "Approximately 50%" },
        { name: "B", value: "Approximately 70%" },
        { name: "C", value: "Approximately 90%" },
        { name: "D", value: "Approximately 30%" }
      ],
      correctAnswer: "B"
    },
    {
      question: "Which country has the largest land area on Earth?",
      answers: [
        { name: "A", value: "Russia" },
        { name: "B", value: "Canada" },
        { name: "C", value: "China" },
        { name: "D", value: "United States" }
      ],
      correctAnswer: "A"
    },
    {
      question: "In which position is Earth in terms of size among all the planets in the solar system?",
      answers: [
        { name: "A", value: "Second largest" },
        { name: "B", value: "Third largest" },
        { name: "C", value: "Fourth largest" },
        { name: "D", value: "Fifth largest" }
      ],
      correctAnswer: "B"
    },
    {
      question: "What percentage of Earth's atmosphere is made up of oxygen?",
      answers: [
        { name: "A", value: "Approximately 21%" },
        { name: "B", value: "Approximately 50%" },
        { name: "C", value: "Approximately 10%" },
        { name: "D", value: "Approximately 5%" }
      ],
      correctAnswer: "A"
    },
    {
      question: "Approximately how long does it take for Earth to complete one orbit around the Sun?",
      answers: [
        { name: "A", value: "365 days" },
        { name: "B", value: "24 hours" },
        { name: "C", value: "30 days" },
        { name: "D", value: "1 year" }
      ],
      correctAnswer: "D"
    }
  ];
  
  quizForm!:FormGroup;
  keyObj:any = {
    question0: "B",
    question1: "A",
    question2: "B",
    question3: "A",
    question4: "D"
  };
  constructor(private apiService: ApiService,public dialog: MatDialog) { }
  ngOnInit(): void {
    const currentUser = this.apiService.getToken();
    this.uid=this.apiService.getUid()
    if (currentUser) {
      this.apiService.getUserInfo().subscribe((res) => {
        this.userSettings = res;
      })
    }
    const group:any = {};
    this.questions.forEach((question, index) => {
      group[`question${index}`] = new FormControl('',Validators.required);
    });
    this.quizForm = new FormGroup(group);
  }

  onSubmit() {
    if(this.quizForm.valid){
      this.points = 0;
      Object.keys(this.keyObj).forEach(key => {
        if (this.quizForm.value[key] === this.keyObj[key]) {
          this.points++;
        }
      });
      this.dialog
      .open(this.dialogBox, {})
      .afterClosed()
      .subscribe((res) => {
        // console.log(res);
        this.saveStorename()
      });
    }
    else{
      this.quizForm.updateValueAndValidity()
    }
  }
  getTemplate(){
    return this[this.topic as keyof HomeComponent];
  }
  
  saveStorename() {
      this.isLoading=true;
      this.userSettings.points+= this.points
      this.apiService.updateDocument('userinfo', 'data', this.userSettings).then(() => {
        localStorage.setItem('userinfo', JSON.stringify(this.userSettings))
        this.isLoading=false
      }).catch((err: any) => {
        alert("Error occured");
        this.isLoading=false
      })
    }
}
