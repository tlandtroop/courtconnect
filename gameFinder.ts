import React, { useState, useEffect, useCallback } from 'react';
import './ProjectDashboard.css'; // You can create this CSS file later

// Define types for project tasks
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  dueDate?: Date;
}

// Define props for the dashboard component
interface ProjectDashboardProps {
  projectName: string;
  projectDescription?: string;
  teamMembers: string[];
  startDate: Date;
  endDate: Date;
  tasks?: Task[];
  showCompletedTasks?: boolean;
}

/**
 * ProjectDashboard Component
 * 
 * A comprehensive dashboard for tracking project status, tasks, and team information.
 * This component can serve as a central hub for project management within the application.
 * 
 * Features:
 * - Project overview with completion percentage
 * - Timeline visualization with days remaining
 * - Task management with filtering capabilities
 * - Team member assignment tracking
 * 
 * @param props ProjectDashboardProps
 */
const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projectName,
  projectDescription = "No description provided",
  teamMembers,
  startDate,
  endDate,
  tasks = [],
  showCompletedTasks = false,
}) => {
  // State hooks
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Calculate the project timeline details
  useEffect(() => {
    const calculateTimelineDetails = () => {
      const today = new Date();
      
      // Calculate days remaining
      const timeDifference = endDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setDaysRemaining(Math.max(0, remainingDays));
      
      // Calculate project duration and elapsed time
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedTime = today.getTime() - startDate.getTime();
      
      // Ensure percentage doesn't exceed 100 or go below 0
      if (elapsedTime <= 0) {
        setCompletionPercentage(0);
      } else if (elapsedTime >= totalDuration) {
        setCompletionPercentage(100);
      } else {
        setCompletionPercentage(Math.round((elapsedTime / totalDuration) * 100));
      }
    };
    
    calculateTimelineDetails();
    // Update daily
    const interval = setInterval(calculateTimelineDetails, 86400000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);
  
  // Filter tasks based on status and assigned team member
  useEffect(() => {
    let result = [...tasks];
    
    // Filter by completion status if needed
    if (!showCompletedTasks) {
      result = result.filter((task) => task.status !== 'done');
    }
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      result = result.filter((task) => task.status === selectedFilter);
    }
    
    // Apply team member filter
    if (selectedTeamMember !== 'all') {
      result = result.filter((task) => task.assignee === selectedTeamMember);
    }
    
    setFilteredTasks(result);
  }, [tasks, selectedFilter, selectedTeamMember, showCompletedTasks]);
  
  // Calculate task statistics
  const calculateTaskStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'done').length;
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
    const inReview = tasks.filter((task) => task.status === 'review').length;
    const todo = tasks.filter((task) => task.status === 'todo').length;
    
    return {
      total,
      completed,
      inProgress,
      inReview,
      todo,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate if project is on track, ahead, or behind
  const getProjectStatus = (): { status: string; className: string } => {
    const taskStats = calculateTaskStats();
    
    if (taskStats.completionRate >= completionPercentage + 10) {
      return { status: 'Ahead of Schedule', className: 'status-ahead' };
    } else if (taskStats.completionRate <= completionPercentage - 10) {
      return { status: 'Behind Schedule', className: 'status-behind' };
    } else {
      return { status: 'On Track', className: 'status-on-track' };
    }
  };
  
  // Get priority CSS class
  const getPriorityClass = (priority: Task['priority']): string => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'critical': return 'priority-critical';
      default: return '';
    }
  };
  
  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const taskStats = calculateTaskStats();
  const projectStatus = getProjectStatus();
  
  return (
    <div className="project-dashboard">
      <div className="dashboard-header">
        <h1>{projectName}</h1>
        <button 
          className="expand-button"
          onClick={toggleExpand}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="project-overview">
        <div className="overview-section">
          <h2>Project Overview</h2>
          <p className="project-description">{projectDescription}</p>
          
          <div className="project-timeline">
            <div className="timeline-dates">
              <div className="date-item">
                <span className="date-label">Start:</span> 
                <span className="date-value">{formatDate(startDate)}</span>
              </div>
              <div className="date-item">
                <span className="date-label">Deadline:</span> 
                <span className="date-value">{formatDate(endDate)}</span>
              </div>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="progress-stats">
                <p>{completionPercentage}% of timeline elapsed</p>
                <p className={projectStatus.className}>{projectStatus.status}</p>
                <p>{daysRemaining} days remaining</p>
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="task-statistics">
            <h2>Task Statistics</h2>
            <div className="stat-container">
              <div className="stat-item">
                <span className="stat-value">{taskStats.total}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{taskStats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{taskStats.inProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{taskStats.inReview}</span>
                <span className="stat-label">In Review</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{taskStats.todo}</span>
                <span className="stat-label">To Do</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{taskStats.completionRate}%</span>
                <span className="stat-label">Completion Rate</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="team-section">
          <h2>Team Members</h2>
          <div className="team-list">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-avatar">
                  {member.charAt(0).toUpperCase()}
                </div>
                <span className="member-name">{member}</span>
                <span className="member-tasks">
                  {tasks.filter(task => task.assignee === member).length} tasks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Project Tasks</h2>
          <div className="filters">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="done">Completed</option>
            </select>
            
            <select 
              value={selectedTeamMember}
              onChange={(e) => setSelectedTeamMember(e.target.value)}
            >
              <option value="all">All Team Members</option>
              {teamMembers.map((member, index) => (
                <option key={index} value={member}>{member}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.status}`}>
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-meta">
                  <div className="task-assignee">
                    <span className="meta-label">Assignee:</span>
                    <span className="meta-value">{task.assignee}</span>
                  </div>
                  
                  <div className="task-status">
                    <span className="meta-label">Status:</span>
                    <span className={`status-badge ${task.status}`}>{task.status}</span>
                  </div>
                  
                  {task.dueDate && (
                    <div className="task-due-date">
                      <span className="meta-label">Due:</span>
                      <span className="meta-value">{formatDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-tasks">
              <p>No tasks match the current filters.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p>This is a placeholder component for the senior design project</p>
      </div>
    </div>
  );
};

export default ProjectDashboard;