import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonetComponent } from './nonet.component';

describe('NonetComponent', () => {
  let component: NonetComponent;
  let fixture: ComponentFixture<NonetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NonetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NonetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
