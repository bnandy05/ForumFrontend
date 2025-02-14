import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TopicService } from '../../services/topic.service';
import { CommonModule } from '@angular/common';

export interface Topic {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
}


@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  topics: Topic[] = [];

  constructor(private topicService: TopicService) {}

  ngOnInit() {
    this.topicService.getTopics().subscribe({
      next: (topics) => {
        console.log('Topics:', topics);
        this.topics = topics.data;
      },
      error: (err) => {
        console.error('Failed to fetch topics:', err);
      }
    });
  }
}
