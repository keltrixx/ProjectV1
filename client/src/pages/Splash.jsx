import React from 'react';
import { Link } from 'react-router-dom';

export default function Splash() {
  return (
    <div className="flex flex-col gap-16 py-6">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl leading-tight">
            School Uniform <br />
            Exchange Platform System
          </h1>

          <p className="text-xl font-bold text-navy">
            Exchange. Reuse. Support Students.
          </p>

          <p className="max-w-md text-base leading-relaxed text-slate-600">
            A simple and sustainable way for students to buy, sell, donate, and exchange school uniforms.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/register" className="btn-primary px-8 py-3">
              Get Started
            </Link>
            <Link to="/browse" className="btn-outline px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="card relative flex aspect-square w-full max-w-md flex-col items-center justify-center overflow-hidden bg-slate-50 p-6 shadow-inner">
            <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1.5">
              <svg className="h-5 w-5 text-leaf" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.083 9h11.834a1 1 0 011 1c0 5.523-4.254 10-9.5 10S1 15.523 1 10a1 1 0 011-1h2.083zm.167-2a5 5 0 019.5 0H4.25z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold italic text-leaf">
                Save Uniform. A Brighter Tomorrow.
              </span>
            </div>

            <div className="mt-10 w-56 transform -rotate-2 rounded-lg bg-white p-4 shadow-xl border border-slate-200">
              <div className="flex h-36 items-center justify-center rounded bg-sky/50 text-navy-soft">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3 w-3/4 rounded bg-slate-200"></div>
                <div className="h-3 w-1/2 rounded bg-slate-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 border-t border-slate-200 pt-12 md:grid-cols-3">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-ink">Save Money</h3>
          <p className="max-w-xs text-sm text-slate-500">
            Affordable uniforms for every student.
          </p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-ink">Reduce Waste</h3>
          <p className="max-w-xs text-sm text-slate-500">
            Give uniforms a second life.
          </p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-ink">Support the Community</h3>
          <p className="max-w-xs text-sm text-slate-500">
            Help fellow students in need.
          </p>
        </div>
      </div>
    </div>
  );
}