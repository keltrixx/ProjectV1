import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Splash = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-auto">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              School Uniform <br />
              Exchange Platform System
            </h1>
            
            <p className="text-xl font-bold text-slate-800">
              Exchange. Reuse. Support Students.
            </p>

            <p className="text-slate-600 max-w-md text-base leading-relaxed">
              A simple and sustainable way for students to buy, sell, donate, and exchange school uniforms.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="bg-sky-900 hover:bg-sky-950 text-white font-medium px-8 py-3 rounded-md shadow transition duration-200 text-center"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-8 py-3 rounded-md shadow-sm transition duration-200 text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative bg-slate-100 rounded-2xl p-6 shadow-inner w-full max-w-lg aspect-square flex flex-col justify-center items-center overflow-hidden">
              <div className="absolute top-8 left-8 flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h11.834a1 1 0 011 1c0 5.523-4.254 10-9.5 10S1 15.523 1 10a1 1 0 011-1h2.083zm.167-2a5 5 0 019.5 0H4.25z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-emerald-800 italic">
                  Save Uniform. A Brighter Tomorrow.
                </span>
              </div>

              <div className="w-64 bg-white rounded-lg p-4 shadow-xl border border-slate-100 mt-12 transform -rotate-1">
                <div className="h-40 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-slate-200 mt-12">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-slate-900 text-white rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Save Money</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Affordable uniforms for every student.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-slate-900 text-white rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Reduce Waste</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Give uniforms a second life.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-slate-900 text-white rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Support the Community</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Help fellow students in need.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Splash;