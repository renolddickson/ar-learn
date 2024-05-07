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
  topic!: any;
  userSettings: any;
  uid: any;
  isLoading = false;
  points = 0;
  attempt=0;
  @ViewChild('earth') earth!: ElementRef;
  @ViewChild('mech') mech!: ElementRef;
  @ViewChild('health') health!: ElementRef;
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
  electricMotorQuestions = [
    {
      question: "What is the primary function of the stator in an electric motor?",
      answers: [
        { name: "A", value: "To provide mechanical support" },
        { name: "B", value: "To generate a rotating magnetic field" },
        { name: "C", value: "To convert electrical energy into mechanical energy" },
        { name: "D", value: "To regulate the motor’s speed" }
      ],
      correctAnswer: "B"
    },
    {
      question: "Which type of motor is commonly used in household appliances like refrigerators and air conditioners?",
      answers: [
        { name: "A", value: "Single-phase induction motor" },
        { name: "B", value: "Synchronous motor" },
        { name: "C", value: "Brushless DC motor" },
        { name: "D", value: "Universal motor" }
      ],
      correctAnswer: "A"
    },
    {
      question: "Which type of motor provides the highest starting torque?",
      answers: [
        { name: "A", value: "DC series motor" },
        { name: "B", value: "DC shunt motor" },
        { name: "C", value: "AC induction motor" },
        { name: "D", value: "Brushless DC motor" }
      ],
      correctAnswer: "A"
    },
    {
      question: "Which motor is suitable for applications requiring variable speed control?",
      answers: [
        { name: "A", value: "DC motor" },
        { name: "B", value: "AC motor" },
        { name: "C", value: "Stepper motor" },
        { name: "D", value: "Synchronous motor" }
      ],
      correctAnswer: "A"
    },
    {
      question: "Which type of motor is commonly used in electric vehicles?",
      answers: [
        { name: "A", value: "Permanent magnet motor" },
        { name: "B", value: "Universal motor" },
        { name: "C", value: "Synchronous motor" },
        { name: "D", value: "Reluctance motor" }
      ],
      correctAnswer: "A"
    }
  ];
  nutritionQuestions = [
    {
      question: "Which of the following food components give energy to our body?",
      answers: [
        { name: "A", value: "Proteins" },
        { name: "B", value: "Vitamins" },
        { name: "C", value: "Minerals" },
        { name: "D", value: "Carbohydrates" }
      ],
      correctAnswer: "D"
    },
    {
      question: "Which of the following mineral functions by building strong bones and teeth?",
      answers: [
        { name: "A", value: "Iodine" },
        { name: "B", value: "Calcium" },
        { name: "C", value: "Iron" },
        { name: "D", value: "Sodium" }
      ],
      correctAnswer: "B"
    },
    {
      question: "Which of the following food components does not provide any nutrients?",
      answers: [
        { name: "A", value: "Milk" },
        { name: "B", value: "Water" },
        { name: "C", value: "Fruit Juice" },
        { name: "D", value: "Vegetable soup" }
      ],
      correctAnswer: "B"
    },
    {
      question: "The most significant and essential mineral required for our body is ____.",
      answers: [
        { name: "A", value: "Iron" },
        { name: "B", value: "Sodium" },
        { name: "C", value: "Calcium" },
        { name: "D", value: "All of the above" }
      ],
      correctAnswer: "D"
    },
    {
      question: "Which of the following food items is the best source of plant proteins?",
      answers: [
        { name: "A", value: "Milk" },
        { name: "B", value: "Egg" },
        { name: "C", value: "Legumes" },
        { name: "D", value: "Cheese" }
      ],
      correctAnswer: "C"
    }
  ];

  quizForm!: FormGroup;
  keyObj: any;
  constructor(private apiService: ApiService, public dialog: MatDialog) { }
  ngOnInit(): void {
    const currentUser = this.apiService.getToken();
    this.uid = this.apiService.getUid()
    if (currentUser) {
      this.apiService.getUserInfo().subscribe((res) => {
        this.userSettings = res;
      })
    }
    const group: any = {};
    this.questions.forEach((question, index) => {
      group[`question${index}`] = new FormControl('', Validators.required);
    });
    this.quizForm = new FormGroup(group);
  }
  setAnswer(cat: any) {
    if (cat == 'earth') {
      this.keyObj = {
        question0: "B",
        question1: "A",
        question2: "B",
        question3: "A",
        question4: "D"
      };
    } else if (cat == 'mech') {
      this.keyObj = {
        question0: "B",
        question1: "A",
        question2: "A",
        question3: "A",
        question4: "A"
      }
    } else if (cat == 'health') {
      this.keyObj = {
        question0: "D",
        question1: "B",
        question2: "B",
        question3: "D",
        question4: "C"
      }
    }
  }
  onSubmit() {
    if (this.quizForm.valid) {
      this.attempt=1
      this.points = 0;
      Object.keys(this.keyObj).forEach(key => {
        console.log(this.quizForm.value[key],this.keyObj[key]);
        
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
    else {
      this.quizForm.updateValueAndValidity()
    }
  }
  getTemplate() {
    return this[this.topic as keyof HomeComponent];
  }

  saveStorename() {
    this.isLoading = true;
    if(!this.userSettings.attempt)
      this.userSettings.attempt=0
    this.userSettings.points += this.points;
    this.userSettings.attempt += this.attempt;
    this.apiService.updateDocument('userinfo', 'data', this.userSettings).then(() => {
      localStorage.setItem('userinfo', JSON.stringify(this.userSettings))
      this.isLoading = false
    }).catch((err: any) => {
      alert("Error occured");
      this.isLoading = false
    })
  }
}
