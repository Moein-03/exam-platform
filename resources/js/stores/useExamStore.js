import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useExamStore = create(
     persist(
          (set, get) => ({
               currentIndex: 0,
               answers: [],
               timeLeft: null,
               examStarted: false,
               examId: null,
               questions: [],
               loading: false,

               initExam: (examId, questions, durationMinutes) => {
                    set({
                         examId,
                         questions,
                         currentIndex: 0,
                         answers: [],
                         timeLeft: durationMinutes * 60,
                         examStarted: true,
                    });
               },

               setAnswer: (questionId, answer) => {
                    const existingIndex = get().answers.findIndex(a => a.question_id === questionId);
                    let newAnswers;
                    if (existingIndex !== -1) {
                         newAnswers = [...get().answers];
                         newAnswers[existingIndex] = { question_id: questionId, answer };
                    } else {
                         newAnswers = [...get().answers, { question_id: questionId, answer }];
                    }
                    set({ answers: newAnswers });
                    // ذخیره خودکار در سرور
                    if (get().examId) {
                         axios.post(`/api/exams/${get().examId}/save-answer`, {
                         question_id: questionId,
                         answer,
                         }).catch(err => console.error("Auto-save failed", err));
                    }
               },

               nextQuestion: () => {
                    if (get().currentIndex < get().questions.length - 1) {
                         set({ currentIndex: get().currentIndex + 1 });
                    }
               },

               prevQuestion: () => {
                    if (get().currentIndex > 0) {
                         set({ currentIndex: get().currentIndex - 1 });
                    }
               },

               decrementTime: () => {
                    if (get().timeLeft > 0) {
                         set({ timeLeft: get().timeLeft - 1 });
                    }
               },

               resetExam: () => {
                    set({
                         currentIndex: 0,
                         answers: [],
                         timeLeft: null,
                         examStarted: false,
                         examId: null,
                         questions: [],
                    });
                    localStorage.removeItem('exam-storage');
               }
          }),
          {
               name: 'exam-storage',
               partialize: (state) => ({
                    answers: state.answers,
                    currentIndex: state.currentIndex,
                    timeLeft: state.timeLeft,
                    examId: state.examId,
               })
          }
     )
);

export default useExamStore;