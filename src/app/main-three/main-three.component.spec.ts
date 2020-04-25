import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainThreeComponent } from './main-three.component';

describe('MainThreeComponent', () => {
  let component: MainThreeComponent;
  let fixture: ComponentFixture<MainThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
