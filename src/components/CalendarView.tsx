import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronDown,
  Sun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudSun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleCalendarEvent, CalendarViewType } from '../types';

interface CalendarViewProps {
  events: GoogleCalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  isLoading: boolean;
  calendarTheme?: 'normal' | 'grey' | 'pink' | 'dark';
  weatherData?: any;
  isWeatherLoading?: boolean;
  weatherError?: string | null;
}

export default function CalendarView({ 
  events, 
  selectedDate, 
  onSelectDate, 
  isLoading,
  calendarTheme = 'normal',
  weatherData,
  isWeatherLoading = false,
  weatherError = null
}: CalendarViewProps) {
  const [view, setView] = useState<CalendarViewType>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<GoogleCalendarEvent | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'work' | 'personal' | 'meeting'>('all');

  // Helper arrays
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Dynamic styles depending on calendarTheme ('normal' | 'grey' | 'pink' | 'dark')
  const themeStyles = useMemo(() => {
    switch (calendarTheme) {
      case 'grey':
        return {
          bgWrapper: 'bg-[#1C1C1E] border-[#2C2C2E] text-zinc-100',
          bgHeader: 'p-4 border-b border-[#2C2C2E] bg-[#151516] space-y-4',
          bgTimeline: 'flex bg-[#1C1C1E]',
          bgControlBox: 'flex bg-[#252527] p-1 rounded-xl border border-[#2C2C2E]',
          bgInput: 'w-full pl-10 pr-4 py-2 font-sans text-xs bg-[#252527] border border-[#2C2C2E] rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:bg-[#2C2C2F] focus:outline-hidden focus:ring-1 focus:ring-zinc-650 transition-all font-semibold',
          selectStyle: 'pl-8 pr-8 py-1.5 font-sans text-xs font-semibold border border-[#2C2C2E] rounded-xl bg-[#252527] text-zinc-100 appearance-none hover:bg-[#2C2C2E] cursor-pointer focus:outline-hidden',
          weekdayHeader: 'py-2.5 font-sans font-medium text-xs text-zinc-400 border-b border-[#2C2C2E] bg-[#151516] uppercase tracking-wider',
          cellActive: 'bg-[#151516] border-b border-r border-[#242426]',
          cellInactive: 'bg-[#0E0E0F]/60 text-zinc-500 border-b border-r border-[#1B1B1C] opacity-40',
          cellHover: 'hover:bg-[#222225]',
          cellSelected: 'bg-[#29292C]',
          textThemeAccent: 'text-zinc-350',
          todayCircle: 'bg-zinc-600 text-white shadow-xs font-black ring-1 ring-zinc-500',
          hourStampCol: 'border-r border-[#2C2C2E] text-[10px] font-sans font-medium text-zinc-400 text-center flex items-center justify-center bg-[#1E1E20]'
        };
      case 'pink':
        return {
          bgWrapper: 'bg-[#130E14] border-[#2C1F2E] text-pink-100',
          bgHeader: 'p-4 border-b border-[#2C1F2E] bg-[#0E0A0F] space-y-4',
          bgTimeline: 'flex bg-[#130E14]',
          bgControlBox: 'flex bg-[#211624] p-1 rounded-xl border border-[#2C1F2E]',
          bgInput: 'w-full pl-10 pr-4 py-2 font-sans text-xs bg-[#211624] border border-[#2C1F2E] rounded-xl text-pink-100 placeholder:text-pink-700 focus:bg-[#291A2D] focus:outline-hidden focus:ring-1 focus:ring-pink-500 transition-all font-semibold',
          selectStyle: 'pl-8 pr-8 py-1.5 font-sans text-xs font-semibold border border-[#2C1F2E] rounded-xl bg-[#211624] text-pink-100 appearance-none hover:bg-[#2C1F2E] cursor-pointer focus:outline-hidden',
          weekdayHeader: 'py-2.5 font-sans font-medium text-xs text-pink-400 border-b border-[#2C1F2E] bg-[#0E0A0F] uppercase tracking-wider',
          cellActive: 'bg-[#110A14] border-b border-r border-[#1C1221]',
          cellInactive: 'bg-[#0B050D]/60 text-pink-850 border-b border-r border-[#140C1A] opacity-40',
          cellHover: 'hover:bg-[#1B1121]',
          cellSelected: 'bg-[#24132B]',
          textThemeAccent: 'text-pink-300',
          todayCircle: 'bg-pink-600 text-white shadow-xs font-black ring-1 ring-pink-500',
          hourStampCol: 'border-r border-[#2C1F2E] text-[10px] font-sans font-medium text-pink-400 text-center flex items-center justify-center bg-[#170E1A]'
        };
      case 'dark':
        return {
          bgWrapper: 'bg-black border-[#1C1C1C] text-neutral-100',
          bgHeader: 'p-4 border-b border-[#1C1C1C] bg-black space-y-4',
          bgTimeline: 'flex bg-black',
          bgControlBox: 'flex bg-[#0A0A0A] p-1 rounded-xl border border-[#1C1C1C]',
          bgInput: 'w-full pl-10 pr-4 py-2 font-sans text-xs bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl text-neutral-100 placeholder:text-neutral-750 focus:bg-[#111] focus:outline-hidden focus:ring-1 focus:ring-neutral-700 transition-all font-semibold',
          selectStyle: 'pl-8 pr-8 py-1.5 font-sans text-xs font-semibold border border-[#1C1C1C] rounded-xl bg-[#0A0A0A] text-neutral-100 appearance-none hover:bg-[#1A1A1A] cursor-pointer focus:outline-hidden',
          weekdayHeader: 'py-2.5 font-sans font-medium text-xs text-neutral-400 border-b border-[#1C1C1C] bg-black uppercase tracking-wider',
          cellActive: 'bg-black border-b border-r border-[#121212]',
          cellInactive: 'bg-black/60 text-neutral-750 border-b border-r border-[#0A0A0A] opacity-30',
          cellHover: 'hover:bg-[#070707]',
          cellSelected: 'bg-[#0E0E0E]',
          textThemeAccent: 'text-neutral-200',
          todayCircle: 'bg-neutral-800 text-white shadow-xs font-black ring-1 ring-neutral-750',
          hourStampCol: 'border-r border-[#1C1C1C] text-[10px] font-sans font-medium text-neutral-400 text-center flex items-center justify-center bg-[#111111]'
        };
      case 'normal':
      default:
        return {
          bgWrapper: 'bg-[#0F0F0F] border-[#2A2A2A] text-gray-200',
          bgHeader: 'p-4 border-b border-[#2A2A2A] bg-[#0A0A0A] space-y-4',
          bgTimeline: 'flex bg-[#0F0F0F]',
          bgControlBox: 'flex bg-[#1A1A1A] p-1 rounded-xl border border-[#2A2A2A]',
          bgInput: 'w-full pl-10 pr-4 py-2 font-sans text-xs bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-100 placeholder:text-gray-550 focus:bg-[#242424] focus:outline-hidden focus:ring-1 focus:ring-[#3A3A3A] transition-all font-semibold',
          selectStyle: 'pl-8 pr-8 py-1.5 font-sans text-xs font-semibold border border-[#2A2A2A] rounded-xl bg-[#1A1A1A] text-gray-205 appearance-none hover:bg-[#2A2A2A] cursor-pointer focus:outline-hidden',
          weekdayHeader: 'py-2.5 font-sans font-medium text-xs text-gray-500 border-b border-[#2A2A2A] bg-[#0A0A0A] uppercase tracking-wider',
          cellActive: 'bg-[#0A0A0A] border-b border-r border-[#1A1A1A]',
          cellInactive: 'bg-[#050505]/50 text-gray-600 border-b border-r border-[#151515] opacity-40',
          cellHover: 'hover:bg-[#121212]',
          cellSelected: 'bg-[#161616]',
          textThemeAccent: 'text-indigo-400',
          todayCircle: 'bg-indigo-650 text-white shadow-xs font-bold',
          hourStampCol: 'border-r border-[#1A1A1A] text-[10px] font-sans font-medium text-gray-500 text-center flex items-center justify-center bg-[#0D0D0D]'
        };
    }
  }, [calendarTheme]);

  // Derive target date parameters
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Filter events based on search query and categorized keywords
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const title = (event.summary || '').toLowerCase();
      const desc = (event.description || '').toLowerCase();
      const loc = (event.location || '').toLowerCase();
      const matchSearch = 
        title.includes(searchQuery.toLowerCase()) || 
        desc.includes(searchQuery.toLowerCase()) ||
        loc.includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (categoryFilter === 'all') return true;
      if (categoryFilter === 'work') {
        return title.includes('work') || title.includes('project') || title.includes('dev') || title.includes('sync');
      }
      if (categoryFilter === 'personal') {
        return title.includes('personal') || title.includes('call') || title.includes('appointment') || title.includes('family') || title.includes('coffee') || title.includes('dinner');
      }
      if (categoryFilter === 'meeting') {
        return title.includes('meeting') || title.includes('interview') || title.includes('review') || title.includes('discussion');
      }
      return true;
    });
  }, [events, searchQuery, categoryFilter]);

  // Navigate dates
  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onSelectDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onSelectDate(newDate);
  };

  const handleToday = () => {
    onSelectDate(new Date());
  };

  // Monthly Calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthCells = useMemo(() => {
    const cells: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month's leading days
    const totalCells = cells.length;
    const remainingDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingDays; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month, firstDayOfMonth, daysInMonth, daysInPrevMonth]);

  // Weekly Calculations (Start Sunday to Saturday)
  const weekDaysList = useMemo(() => {
    const days: Date[] = [];
    const currentDayOfWeek = selectedDate.getDay();
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - currentDayOfWeek);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  // Check if dates are equivalent
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isToday = (d: Date) => {
    return isSameDay(d, new Date());
  };

  // Get events on a target day
  const getEventsForDay = (d: Date) => {
    return filteredEvents.filter(event => {
      const startStr = event.start.dateTime || event.start.date;
      if (!startStr) return false;
      const startD = new Date(startStr);
      return isSameDay(startD, d);
    });
  };

  // Event coloring logic based on summary or category
  const getEventColor = (summary: string) => {
    const s = summary.toLowerCase();
    if (s.includes('work') || s.includes('project') || s.includes('sync')) {
      return { bg: 'bg-emerald-900/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60', dot: 'bg-emerald-450' };
    }
    if (s.includes('personal') || s.includes('call') || s.includes('coffee') || s.includes('dinner')) {
      return { bg: 'bg-amber-900/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/60', dot: 'bg-amber-450' };
    }
    if (s.includes('meeting') || s.includes('interview') || s.includes('review') || s.includes('discussion')) {
      return { bg: 'bg-indigo-900/40 text-indigo-350 border-indigo-800/60 hover:bg-indigo-900/60', dot: 'bg-indigo-400' };
    }
    return { bg: 'bg-sky-900/40 text-sky-300 border-sky-800/60 hover:bg-sky-900/60', dot: 'bg-sky-405' };
  };

  // Parse formatted human-readable time from event start (e.g. 10:30 AM)
  const getEventTime = (event: GoogleCalendarEvent) => {
    if (event.start.date) return 'All Day';
    if (!event.start.dateTime) return '';
    const date = new Date(event.start.dateTime);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-full ${themeStyles.bgWrapper} rounded-2xl border ${calendarTheme === 'pink' ? 'border-[#2C1F2E]' : calendarTheme === 'grey' ? 'border-[#2C2C2E]' : calendarTheme === 'dark' ? 'border-[#1C1C1C]' : 'border-[#2A2A2A]'} shadow-sm overflow-hidden`} id="calendar_main_wrapper">
      {/* Calendar Header with views / search */}
      <div className={themeStyles.bgHeader} id="calendar_header_controls">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center flex-wrap gap-3">
            <div className={themeStyles.bgControlBox}>
              <button 
                onClick={handlePrev}
                className={`p-1.5 rounded-lg transition-all text-gray-400 hover:text-white cursor-pointer ${calendarTheme === 'pink' ? 'hover:bg-pink-950/45' : calendarTheme === 'grey' ? 'hover:bg-[#2C2C2E]' : 'hover:bg-[#2A2A2A]'}`}
                id="btn_prev_date"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleToday}
                className={`px-3 py-1 font-sans text-xs font-semibold rounded-lg transition-all text-gray-300 hover:text-white cursor-pointer ${calendarTheme === 'pink' ? 'hover:bg-pink-950/45' : calendarTheme === 'grey' ? 'hover:bg-[#2C2C2E]' : 'hover:bg-[#2A2A2A]'}`}
                id="btn_today"
              >
                Today
              </button>
              <button 
                onClick={handleNext}
                className={`p-1.5 rounded-lg transition-all text-gray-400 hover:text-white cursor-pointer ${calendarTheme === 'pink' ? 'hover:bg-pink-950/45' : calendarTheme === 'grey' ? 'hover:bg-[#2C2C2E]' : 'hover:bg-[#2A2A2A]'}`}
                id="btn_next_date"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="font-sans font-semibold text-sm md:text-base text-[#E5E7EB] tracking-tight" id="calendar_title_month">
                {view === 'month' && `${months[month]} ${year}`}
                {view === 'week' && `Week of ${weekDaysList[0].toLocaleDateString([], { month: 'short', day: 'numeric' })}`}
                {view === 'day' && selectedDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>

              {/* Weather Chip embedded in Calendar Header */}
              {isWeatherLoading ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-900/60 border border-neutral-800 text-gray-500 text-[10px] font-sans font-semibold animate-pulse shrink-0">
                  <div className="w-2.5 h-2.5 border-2 border-t-indigo-550 border-neutral-700 rounded-full animate-spin"></div>
                  <span>Loading weather...</span>
                </div>
              ) : weatherData ? (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-950/25 hover:bg-indigo-950/35 border border-indigo-900/25 rounded-full text-[10px] sm:text-[11px] font-sans transition-all cursor-default text-indigo-300 shrink-0">
                  <CloudSun size={11} className="text-indigo-405 shrink-0" />
                  <span className="font-bold">{weatherData.city} {weatherData.temp}°F</span>
                  <span className="text-neutral-600 font-mono">|</span>
                  <span className="text-neutral-400 capitalize hidden sm:inline">{weatherData.description}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* View Toggles & Filters */}
          <div className="flex items-center flex-wrap gap-2">
            {/* View Selector Buttons */}
            <div className={themeStyles.bgControlBox}>
              {(['month', 'week', 'day'] as CalendarViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1 font-sans text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    view === v 
                      ? (calendarTheme === 'pink' ? 'bg-pink-955/75 bg-pink-900/40 text-pink-200 border border-pink-800/40' : calendarTheme === 'grey' ? 'bg-zinc-700 text-white border border-zinc-650' : calendarTheme === 'dark' ? 'bg-[#1A1A1A] text-white border border-[#2A2A2A]' : 'bg-[#2A2A2A] text-white shadow-xs border border-[#3A3A3A]')
                      : 'text-gray-400 hover:text-white'
                  }`}
                  id={`btn_view_${v}`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Category selection */}
            <div className="relative inline-flex items-center">
              <Filter size={14} className="absolute left-3 text-gray-500 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className={themeStyles.selectStyle}
                id="category_selector"
              >
                <option value="all">All Items</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏡 Personal</option>
                <option value="meeting">📅 Meetings</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="relative flex items-center md:max-w-md" id="search_events_container">
          <Search size={15} className="absolute left-3.5 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, locations, organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={themeStyles.bgInput}
            id="search_events_input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 font-sans text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Calendar Views Content */}
      <div className="flex-1 overflow-y-auto" id="calendar_grid_scroll">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-3" id="calendar_loading_state">
            <div className="w-8 h-8 border-3 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="font-sans text-xs text-gray-400 font-medium animate-pulse">Syncing Google Calendar events...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view + selectedDate.getTime()}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="h-full min-h-[350px]"
            >
              {view === 'month' && (
                <div className="grid grid-cols-7 h-full text-center" id="calendar_month_grid">
                  {/* Weekday headers */}
                  {weekdays.map((day) => (
                    <div 
                      key={day} 
                      className={themeStyles.weekdayHeader}
                    >
                      {day}
                    </div>
                  ))}

                  {/* Days cells */}
                  {monthCells.map((cell, idx) => {
                    const dayEvents = getEventsForDay(cell.date);
                    const isSelected = isSameDay(cell.date, selectedDate);
                    const currentIsToday = isToday(cell.date);

                    return (
                      <div
                        key={idx}
                        onClick={() => onSelectDate(cell.date)}
                        className={`min-h-[90px] border-b border-r ${calendarTheme === 'pink' ? 'border-[#1C1221]' : calendarTheme === 'grey' ? 'border-[#242426]' : calendarTheme === 'dark' ? 'border-[#121212]' : 'border-[#1A1A1A]'} p-2 text-left cursor-pointer flex flex-col justify-between transition-all group ${
                          cell.isCurrentMonth ? themeStyles.cellActive : themeStyles.cellInactive
                        } ${isSelected ? `${themeStyles.cellSelected} grid-highlight` : themeStyles.cellHover}`}
                        id={`month_cell_${cell.date.getMonth()}_${cell.date.getDate()}`}
                      >
                        {/* Day heading */}
                        <div className="flex items-center justify-between pointer-events-none mb-1">
                          <span 
                            className={`font-sans text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center transition-all ${
                              currentIsToday 
                                ? themeStyles.todayCircle 
                                : isSelected 
                                  ? (calendarTheme === 'pink' ? 'text-pink-100 bg-pink-905 bg-pink-950/80 border border-pink-900/40 font-bold' : calendarTheme === 'grey' ? 'text-zinc-100 bg-zinc-700/80 border border-zinc-650 font-bold' : 'text-white bg-[#2A2A2A]') 
                                  : 'text-gray-350'
                            }`}
                          >
                            {cell.date.getDate()}
                          </span>
                          
                          {/* Indicator for user selected date for syncing photos */}
                          {isSelected && (
                            <span className="w-1.5 h-1.5 bg-indigo-505 bg-indigo-400 rounded-full inline-block mr-1"></span>
                          )}
                        </div>

                        {/* Event Tags inside the cell */}
                        <div className="flex-1 space-y-1 overflow-hidden min-h-[50px] mb-1">
                          {dayEvents.slice(0, 3).map((event) => {
                            const colors = getEventColor(event.summary);
                            return (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                  onSelectDate(cell.date);
                                }}
                                className={`px-1.5 py-0.5 rounded-md border text-[10px] font-sans font-medium truncate flex items-center gap-1 cursor-pointer transition-all ${colors.bg}`}
                              >
                                <span className={`w-1 h-1 rounded-full ${colors.dot} flex-shrink-0`}></span>
                                <span className="truncate">{event.summary || '(No Title)'}</span>
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <div className="font-sans text-[9px] font-semibold text-gray-500 pl-1 text-left">
                              + {dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {view === 'week' && (
                <div className={`flex flex-col h-full bg-[#0F0F0F]`} id="calendar_week_wrapper">
                  {/* Grid Header for Days */}
                  <div className={`grid grid-cols-8 border-b ${calendarTheme === 'pink' ? 'border-[#2C1F2E]' : calendarTheme === 'grey' ? 'border-[#2C2C2E]' : calendarTheme === 'dark' ? 'border-[#1C1C1C]' : 'border-[#2A2A2A]'} ${calendarTheme === 'pink' ? 'bg-[#0E0A0F]/95' : 'bg-[#0A0A0A]/90'} sticky top-0 z-10`} id="calendar_week_days_row">
                    <div className={`border-r ${calendarTheme === 'pink' ? 'border-[#2C1F2E]' : calendarTheme === 'grey' ? 'border-[#2C2C2E]' : calendarTheme === 'dark' ? 'border-[#1C1C1C]' : 'border-[#2A2A2A]'} py-3 font-sans text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center justify-center ${calendarTheme === 'pink' ? 'bg-[#0E0A0F]' : calendarTheme === 'grey' ? 'bg-[#151516]' : 'bg-[#0F0F0F]'}`}>
                      Time
                    </div>
                    {weekDaysList.map((day) => {
                      const isSelected = isSameDay(day, selectedDate);
                      const currentIsToday = isToday(day);
                      return (
                        <div
                          key={day.getTime()}
                          onClick={() => onSelectDate(day)}
                          className={`py-3 text-center border-r ${calendarTheme === 'pink' ? 'border-[#1C1221]' : calendarTheme === 'grey' ? 'border-[#242426]' : calendarTheme === 'dark' ? 'border-[#121212]' : 'border-[#1A1A1A]'} cursor-pointer transition-all flex flex-col items-center gap-1 ${
                            isSelected ? themeStyles.cellSelected : themeStyles.cellHover
                          }`}
                        >
                          <span className="font-sans font-medium text-[11px] text-gray-500">
                            {weekdays[day.getDay()]}
                          </span>
                          <span className={`font-sans text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                            currentIsToday 
                              ? themeStyles.todayCircle 
                              : isSelected 
                                ? 'bg-[#2A2A2A] text-white' 
                                : 'text-gray-300'
                          }`}>
                            {day.getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hourly Grid Rows */}
                  <div className="flex-1 min-h-[400px] overflow-y-auto" id="weekly_hourly_timeline">
                    {Array.from({ length: 15 }).map((_, hourOffset) => {
                      const displayHour = hourOffset + 7; // Hours 7am to 9pm (21:00)
                      const formatHourReadable = (h: number) => {
                        const ampm = h >= 12 ? 'PM' : 'AM';
                        const h12 = h % 12 === 0 ? 12 : h % 12;
                        return `${h12}:00 ${ampm}`;
                      };

                      return (
                        <div key={displayHour} className={`grid grid-cols-8 border-b ${calendarTheme === 'pink' ? 'border-[#1C1221]' : calendarTheme === 'grey' ? 'border-[#1B1B1D]' : calendarTheme === 'dark' ? 'border-[#111111]' : 'border-[#1A1A1A]'} h-16 min-h-[64px]`} id={`week_hour_row_${displayHour}`}>
                          {/* Hour stamp column */}
                          <div className={themeStyles.hourStampCol}>
                            {formatHourReadable(displayHour)}
                          </div>

                          {/* Hours for each 7 columns */}
                          {weekDaysList.map((day) => {
                            const isSelected = isSameDay(day, selectedDate);
                            const dayEvents = getEventsForDay(day);
                            // Filter events overlapping with this hour slot
                            const hourEvents = dayEvents.filter(event => {
                              if (!event.start.dateTime) return false;
                              const start = new Date(event.start.dateTime);
                              const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(start.getTime() + 60 * 60 * 1000);
                              const startH = start.getHours();
                              const endH = end.getHours() + (end.getMinutes() > 0 ? 1 : 0);
                              return displayHour >= startH && displayHour < endH;
                            });

                            return (
                              <div
                                key={day.getTime()}
                                onClick={() => onSelectDate(day)}
                                className={`border-r ${calendarTheme === 'pink' ? 'border-[#1C1221]' : calendarTheme === 'grey' ? 'border-[#242426]' : calendarTheme === 'dark' ? 'border-[#121212]' : 'border-[#1A1A1A]'} p-1 flex flex-col gap-1 overflow-hidden transition-all relative ${
                                  isSelected ? themeStyles.cellSelected : themeStyles.cellActive
                                }`}
                              >
                                {hourEvents.map((event) => {
                                  const colors = getEventColor(event.summary);
                                  return (
                                    <div
                                      key={event.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEvent(event);
                                        onSelectDate(day);
                                      }}
                                      className={`px-1.5 py-1 rounded-lg border text-[10px] font-sans font-medium select-none truncate cursor-pointer shadow-xs transition-all flex flex-col justify-between ${colors.bg}`}
                                      style={{ minHeight: '40px' }}
                                    >
                                      <span className="truncate leading-tight font-semibold block">{event.summary || '(No Title)'}</span>
                                      <span className="text-[8px] opacity-80 mt-1 flex items-center gap-0.5">
                                        <Clock size={8} /> {getEventTime(event)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {view === 'day' && (
                <div className={`p-4 ${themeStyles.cellActive}`} id="calendar_day_layout">
                  <div className={`flex ${calendarTheme === 'pink' ? 'bg-[#1C1221] border-[#2C1F2E]' : calendarTheme === 'grey' ? 'bg-[#252527] border-[#2C2C2E]' : calendarTheme === 'dark' ? 'bg-[#0A0A0A] border-[#1C1C1C]' : 'bg-[#121212] border-[#2A2A2A]'} p-4 rounded-2xl border gap-4 mb-4`}>
                    <CalendarIcon size={36} className="text-gray-550 mt-1" />
                    <div>
                      <h4 className="font-sans font-semibold text-gray-200 text-sm">
                        {selectedDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </h4>
                      <p className="font-sans text-xs text-gray-400 font-medium">
                        {getEventsForDay(selectedDate).length} events scheduled
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3" id="calendar_day_events_list">
                    {getEventsForDay(selectedDate).length === 0 ? (
                      <div className="py-12 text-center text-gray-500 font-sans" id="no_events_on_day">
                        <Clock size={28} className="mx-auto mb-2 text-gray-600" />
                        <p className="text-xs font-semibold">No Events Scheduled</p>
                        <p className="text-[11px] text-gray-500 mt-1">Enjoy a quiet, relaxing day!</p>
                      </div>
                    ) : (
                      getEventsForDay(selectedDate).map((event) => {
                        const colors = getEventColor(event.summary);
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`p-4 rounded-2xl border border-[#2A2A2A] border-l-4 cursor-pointer transition-all hover:translate-x-1 flex flex-col gap-2 relative ${colors.bg}`}
                            id={`day_event_${event.id}`}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-sans font-semibold text-sm mr-4 tracking-tight leading-snug">
                                {event.summary || '(No Title)'}
                              </h3>
                              <span className="font-mono text-[10px] uppercase font-bold text-gray-300 bg-black/40 border border-[#2A2A2A] px-2 py-0.5 rounded-full inline-block">
                                {event.start.date ? 'All Day' : getEventTime(event)}
                              </span>
                            </div>

                            {event.location && (
                              <div className="text-xs font-sans text-gray-350 flex items-center gap-1.5">
                                <MapPin size={12} className="text-gray-500" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}

                            {event.description && (
                              <p className="text-xs font-sans text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                                {event.description}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Floating Event Details Side Panel or Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50" id="event_details_popup">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0F0F0F] rounded-3xl p-6 max-w-md w-full shadow-xl border border-[#2A2A2A] overflow-hidden flex flex-col gap-4 relative text-gray-200"
            >
              {/* Colored tag indicator */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-600`}></div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-[#1A1A1A] hover:bg-[#2A2A2A] p-1.5 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
                id="btn_close_details"
              >
                &times;
              </button>

              <div className="space-y-2 mt-2">
                <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/55 px-2.5 py-1 rounded-full inline-block border border-indigo-900/60">
                  Google Calendar Event
                </span>
                <h3 className="font-sans font-bold text-[#E5E7EB] text-lg tracking-tight leading-snug">
                  {selectedEvent.summary || '(No Title)'}
                </h3>
              </div>

              <div className="space-y-3 py-1 border-y border-[#2A2A2A] text-xs text-gray-300 font-sans">
                {/* Time row */}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="font-medium">
                    {selectedEvent.start.date ? 'All Day' : getEventTime(selectedEvent)}
                    {selectedEvent.start.dateTime && selectedEvent.end.dateTime && (
                      <span className="text-gray-500 font-normal">
                        {' '}
                        ({new Date(selectedEvent.start.dateTime).toLocaleDateString([], { 
                          weekday: 'short', month: 'short', day: 'numeric' 
                        })})
                      </span>
                    )}
                  </span>
                </div>

                {/* Location row */}
                {selectedEvent.location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-500 mt-0.5" />
                    <span className="font-medium leading-normal text-gray-300">{selectedEvent.location}</span>
                  </div>
                )}

                {/* Creator row */}
                {selectedEvent.creator?.email && (
                  <div className="flex items-center gap-2 text-xxs bg-[#1A1A1A] p-2 rounded-xl border border-[#2A2A2A] mt-1">
                    <div className="w-5 h-5 rounded-full bg-[#2B2B2B] flex items-center justify-center text-[10px] font-bold text-gray-300 uppercase">
                      {selectedEvent.creator?.displayName?.[0] || selectedEvent.creator?.email[0]}
                    </div>
                    <div>
                      <span className="font-bold text-gray-400 block">Organizer</span>
                      <span className="text-gray-500">{selectedEvent.creator.displayName || selectedEvent.creator.email}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div className="space-y-1">
                  <span className="font-sans text-[10px] uppercase font-bold text-gray-550 block tracking-wider">Description</span>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed max-h-32 overflow-y-auto whitespace-pre-line bg-[#1A1A1A] p-3 rounded-2xl border border-[#2A2A2A]">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* External Calendar link */}
              {selectedEvent.htmlLink && (
                <a
                  href={selectedEvent.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 font-sans text-xs font-semibold bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-300 rounded-2xl border border-[#2A2A2A] transition-all cursor-pointer shadow-tiny"
                  id="link_open_google_calendar"
                >
                  <ExternalLink size={14} />
                  Open in Google Calendar
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
