import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalRecordComponent } from './personal-record.component';

describe('PersonalRecordComponent', () => {
  let component: PersonalRecordComponent;
  let fixture: ComponentFixture<PersonalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
