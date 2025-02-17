import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TopicService } from '../../../services/topic.service';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-topic-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, EditorModule],
  templateUrl: './topic-create.component.html',
  styleUrl: './topic-create.component.css',
})
export class TopicCreateComponent implements OnInit {
  topicForm: FormGroup;
  categories: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private topicService: TopicService,
    private router: Router
  ) {
    this.topicForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.topicService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      },
    });
  }

  get title() { return this.topicForm.get('title'); }
  get content() { return this.topicForm.get('content'); }
  get category_id() { return this.topicForm.get('category_id'); }

  onSubmit() {
    if (this.topicForm.invalid) {
      Object.keys(this.topicForm.controls).forEach(key => {
        const control = this.topicForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const { title, content, category_id } = this.topicForm.value;

    this.topicService.createTopic(title, content, category_id).subscribe({
      next: (response) => {
        this.router.navigate(['/', response.id]);
      },
      error: (error) => {
        console.error('Hiba történt:', error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      }
    });
  }
}
