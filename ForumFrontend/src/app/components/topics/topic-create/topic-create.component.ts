import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../../services/topic.service';
import { EditorModule } from 'primeng/editor';
import { MessageService, PrimeIcons } from 'primeng/api';
import { Editor } from 'primeng/editor';
import Quill from 'quill';

@Component({
  selector: 'app-topic-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    EditorModule,
  ],
  templateUrl: './topic-create.component.html',
  styleUrl: './topic-create.component.css',
})
export class TopicCreateComponent implements OnInit {
  topicForm: FormGroup;
  categories: any[] = [];
  isSubmitting = false;
  topicId: number | null = null;
  isModifying: boolean = false;
  topics: any[] = [];
  toolbarOptions: any;

  constructor(
    private fb: FormBuilder,
    private topicService: TopicService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.topicForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
    });
    this.toolbarOptions = {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image'],
        ],
        handlers: {
          'image': () => this.triggerFileInput()
        }
      }
    };
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
    this.activatedRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.topicId = idParam ? parseInt(idParam, 10) : null;
    });
    if (this.topicId != null) {
      this.isModifying = true;
      this.topicService.getTopic(this.topicId).subscribe({
        next: (response) => {
          if (response) {
            console.log(response);
            this.topics = [
              {
                ...response.topic,
              },
            ];
            this.topicForm.patchValue({
              title: this.topics[0].title,
              content: this.topics[0].content,
              category_id: this.topics[0].category_id,
            });
          }
        },
        error: (err) => {
          console.error('Hiba történt az adatok frissítésekor:', err);
        },
      });
    } else {
      this.isModifying = false;
    }
  }

  get title() {
    return this.topicForm.get('title');
  }
  get content() {
    return this.topicForm.get('content');
  }
  get category_id() {
    return this.topicForm.get('category_id');
  }

  onSubmit() {
    if (!this.isModifying) {
      if (this.topicForm.invalid) {
        Object.keys(this.topicForm.controls).forEach((key) => {
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
        },
      });
    } else if (this.isModifying) {
      if (this.topicForm.invalid) {
        Object.keys(this.topicForm.controls).forEach((key) => {
          const control = this.topicForm.get(key);
          control?.markAsTouched();
        });
        return;
      }

      this.isSubmitting = true;
      const { title, content, category_id } = this.topicForm.value;

      this.topicService.modifyTopic(title, content, category_id, this.topics[0].id).subscribe({
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
        },
      });
    }
  }

  imageHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: '2 MB-nál nagyobb fájl feltöltése nem engedélyezett.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imageUrl = e.target?.result as string;
      const contentControl = this.topicForm.get('content');

      if (contentControl) {
        const currentContent = contentControl.value || '';
        contentControl.setValue(`${currentContent}<img src="${imageUrl}">`);
      }
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput() {
    document.getElementById('imageUpload')?.click();
  }
}
