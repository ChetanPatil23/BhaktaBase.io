import React, {useEffect, useState} from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  BatchPrediction,
  Cancel,
  CheckCircle,
  Event,
  ExpandLess,
  ExpandMore,
  FilterList,
  Groups,
  LocationOn,
  People,
  PersonAdd,
  Refresh,
  Search
} from '@mui/icons-material';
import {fetchFromApi} from "../../constants/apiconfig.js";

export default function AttendanceForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [centers, setCenters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);

  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [notification, setNotification] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [userAttendanceStatus, setUserAttendanceStatus] = useState(new Map());

  useEffect(() => {
    loadCenters();
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      loadBatches(selectedCenter);
    } else {
      setBatches([]);
      setSelectedBatch('');
    }
  }, [selectedCenter]);

  useEffect(() => {
    if (selectedBatch) {
      loadSessions(selectedBatch);
    } else {
      setSessions([]);
      setSelectedSession('');
    }
  }, [selectedBatch]);

  useEffect(() => {
    if (selectedCenter) {
      loadUsers();
    } else {
      setUsers([]);
      setTotalUsers(0);
      setSelectedUsers(new Set());
    }
  }, [selectedCenter, page, rowsPerPage, searchTerm]);

  const loadCenters = async () => {
    try {
      const data = await fetchFromApi("/center");
      setCenters(data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  const loadBatches = async (centerId) => {
    try {
      const data = await fetchFromApi("/batch");
      const filteredBatches = data.filter(batch => batch.center._id === centerId);
      setBatches(filteredBatches);
    } catch {
      showNotification('Failed to load Batches', 'error');
    }
  };

  const loadSessions = async (batchId) => {
    try {
      const data = await fetchFromApi("/session");
      const filteredSessions = data.filter(batch => batch.batch._id === batchId);
      setSessions(filteredSessions);
    } catch {
      showNotification('Failed to load sessions', 'error');
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchFromApi("/user?role=Participant");
      console.log(selectedCenter);
      const filteredUsers = data.users.filter(user =>
          user.center && user.center._id === selectedCenter
      );

      setUsers(filteredUsers);
      setTotalUsers(filteredUsers.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getUserAttendanceStatus = (user, sessionId) => {
    if (!sessionId) return null;

    const attendance = user.attendance?.find(att => att.session === sessionId);
    return attendance ? {present: attendance.present, markedAt: attendance.markedAt} : null;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({message, type});
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const unmarkedUsers = users.filter(user =>
          !getUserAttendanceStatus(user, selectedSession)
      );
      const newSelected = new Set(unmarkedUsers.map(user => user._id));
      setSelectedUsers(newSelected);
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId) => {
    const user = users.find(u => u._id === userId);
    const attendanceStatus = getUserAttendanceStatus(user, selectedSession);

    if (attendanceStatus) {
      showNotification(
          `${user.name}'s attendance is already marked. Click the status to update.`,
          'info'
      );
      return;
    }

    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const AttendanceSummary = ({users, sessionId}) => {
    if (!sessionId) return null;

    const presentCount = users.filter(user => {
      const status = getUserAttendanceStatus(user, sessionId);
      return status?.present === true;
    }).length;

    const absentCount = users.filter(user => {
      const status = getUserAttendanceStatus(user, sessionId);
      return status?.present === false;
    }).length;

    const notMarkedCount = users.filter(user => {
      const status = getUserAttendanceStatus(user, sessionId);
      return !status;
    }).length;

    return (
        <Paper variant="outlined" sx={{mb: 3, p: {xs: 1, sm: 2}}}>
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
            Attendance Summary
          </Typography>
          <Stack
              direction={isMobile ? "column" : "row"}
              spacing={1}
              sx={{flexWrap: 'wrap'}}
          >
            <Chip
                label={`Present: ${presentCount}`}
                color="success"
                icon={<CheckCircle/>}
                size={isMobile ? "small" : "medium"}
            />
            <Chip
                label={`Absent: ${absentCount}`}
                color="error"
                icon={<Cancel/>}
                size={isMobile ? "small" : "medium"}
            />
            <Chip
                label={`Not Marked: ${notMarkedCount}`}
                color="default"
                icon={<People/>}
                size={isMobile ? "small" : "medium"}
            />
          </Stack>
        </Paper>
    );
  };

  const handleSubmitAttendance = async () => {
    if (!selectedSession) {
      showNotification('Please select a session', 'error');
      return;
    }

    if (selectedUsers.size === 0) {
      showNotification('Please select at least one user', 'error');
      return;
    }

    setShowConfirm(false);
    setSubmitting(true);

    try {
      const userIds = Array.from(selectedUsers);

      const response = await fetchFromApi('/user/attendance/bulk-mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: selectedSession,
          userIds: userIds
        })
      });

      const {results} = response;

      if (results.success.length > 0 && results.failed.length === 0) {
        showNotification(
            `✅ Successfully marked attendance for ${results.success.length} users`,
            'success'
        );
      } else if (results.success.length > 0 && results.failed.length > 0) {
        showNotification(
            `⚠️ Marked attendance for ${results.success.length} users. ${results.failed.length} failed`,
            'warning'
        );

        console.log('Failed attendance marks:', results.failed);

        if (results.failed.length <= 3) {
          results.failed.forEach(failure => {
            const failedUser = users.find(u => u._id === failure.userId);
            showNotification(
                `❌ ${failedUser?.name || 'User'}: ${failure.error}`,
                'error'
            );
          });
        }
      } else {
        showNotification(
            `❌ Failed to mark attendance for all selected users`,
            'error'
        );
      }

      setSelectedUsers(new Set());
      loadUsers();

    } catch (error) {
      console.error('Error marking attendance:', error);
      showNotification(
          `Failed to mark attendance: ${error?.message || 'Unknown error'}`,
          'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateAttendanceStatus = async (userId, sessionId, newStatus) => {
    try {
      const user = users.find(u => u._id === userId);
      if (!user) return;

      const updatedAttendance = user.attendance.map(att => {
        if (att.session === sessionId) {
          return {...att, present: newStatus, markedAt: new Date()};
        }
        return att;
      });

      if (!user.attendance.some(att => att.session === sessionId)) {
        updatedAttendance.push({
          session: sessionId,
          present: newStatus,
          markedAt: new Date()
        });
      }

      const response = await fetchFromApi(`/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance: updatedAttendance
        })
      });

      setUsers(prevUsers =>
          prevUsers.map(u =>
              u._id === userId
                  ? {...u, attendance: updatedAttendance}
                  : u
          )
      );

      showNotification(
          `${user.name} marked as ${newStatus ? 'Present' : 'Absent'}`,
          'success'
      );

    } catch (error) {
      console.error('Error updating attendance:', error);
      showNotification('Failed to update attendance', 'error');
    }
  };

  const AttendanceStatusCell = ({user, sessionId, onStatusUpdate}) => {
    const attendanceStatus = getUserAttendanceStatus(user, sessionId);
    const isSelected = selectedUsers.has(user._id);

    if (!sessionId) {
      return (
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Chip
                label="Select Session"
                size="small"
                color="default"
                variant="outlined"
            />
          </Box>
      );
    }

    if (attendanceStatus) {
      return (
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
            <Chip
                label={attendanceStatus.present ? 'Present' : 'Absent'}
                size="small"
                color={attendanceStatus.present ? 'success' : 'error'}
                icon={attendanceStatus.present ? <CheckCircle/> : <Cancel/>}
                onClick={() => onStatusUpdate(user._id, sessionId, !attendanceStatus.present)}
                sx={{cursor: 'pointer'}}
            />
            {!isMobile && (
                <Tooltip title={`Marked on ${new Date(attendanceStatus.markedAt).toLocaleString()}`}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(attendanceStatus.markedAt).toLocaleDateString()}
                  </Typography>
                </Tooltip>
            )}
          </Box>
      );
    }

    if (isSelected) {
      return (
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Chip
                label="Will be Present"
                size="small"
                color="info"
                icon={<CheckCircle/>}
                variant="outlined"
            />
          </Box>
      );
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <Chip
              label="Not Marked"
              size="small"
              color="default"
              variant="outlined"
          />
        </Box>
    );
  };

  const isAllSelected = users.length > 0 && selectedUsers.size === users.length;
  const isIndeterminate = selectedUsers.size > 0 && selectedUsers.size < users.length;

  const selectedCenter_obj = centers.find(c => c._id === selectedCenter);
  const selectedBatch_obj = batches.find(c => c._id === selectedBatch);
  const selectedSession_obj = sessions.find(s => s._id === selectedSession);

  // Mobile Card View for Users
  const MobileUserCard = ({user}) => {
    const isSelected = selectedUsers.has(user._id);
    const attendanceStatus = getUserAttendanceStatus(user, selectedSession);

    return (
        <Card
            variant="outlined"
            sx={{
              mb: 1,
              cursor: 'pointer',
              border: isSelected ? `2px solid ${theme.palette.primary.main}` : undefined,
              bgcolor: isSelected ? 'action.selected' : undefined
            }}
            onClick={() => handleSelectUser(user._id)}
        >
          <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
            <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 2}}>
              <Checkbox
                  checked={isSelected}
                  onChange={() => handleSelectUser(user._id)}
                  size="small"
              />
              <Box sx={{flexGrow: 1, minWidth: 0}}>
                <Typography variant="subtitle2" sx={{fontWeight: 'medium', mb: 0.5}}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                  {user.contact}
                </Typography>
                <AttendanceStatusCell
                    user={user}
                    sessionId={selectedSession}
                    onStatusUpdate={updateAttendanceStatus}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
    );
  };

  return (
      <Box sx={{
        maxWidth: '100%',
        mx: 'auto',
        p: {xs: 1, sm: 2, md: 3},
        minHeight: '100vh'
      }}>
        <Paper elevation={3} sx={{p: {xs: 2, sm: 3}}}>
          <Box sx={{mb: {xs: 2, sm: 4}}}>
            <Typography
                variant={isMobile ? "h5" : "h4"}
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: {xs: 1, sm: 2},
                  flexWrap: 'wrap'
                }}
            >
              <Groups color="primary"/>
              Attendance Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a center, batch and session to manage attendance for multiple users at once
            </Typography>
          </Box>

          {/* Stats Cards - Responsive Grid */}
          <Grid container spacing={2} sx={{mb: 3}}>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card>
                <CardContent sx={{p: {xs: 1.5, sm: 2}}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: {xs: 1, sm: 2}}}>
                    <Avatar sx={{bgcolor: 'primary.main', width: {xs: 32, sm: 40}, height: {xs: 32, sm: 40}}}>
                      <People sx={{fontSize: {xs: 16, sm: 24}}}/>
                    </Avatar>
                    <Box sx={{minWidth: 0}}>
                      <Typography variant={isMobile ? "body1" : "h6"}>{totalUsers}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Users</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card>
                <CardContent sx={{p: {xs: 1.5, sm: 2}}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: {xs: 1, sm: 2}}}>
                    <Avatar sx={{bgcolor: 'success.main', width: {xs: 32, sm: 40}, height: {xs: 32, sm: 40}}}>
                      <PersonAdd sx={{fontSize: {xs: 16, sm: 24}}}/>
                    </Avatar>
                    <Box sx={{minWidth: 0}}>
                      <Typography variant={isMobile ? "body1" : "h6"}>{selectedUsers.size}</Typography>
                      <Typography variant="caption" color="text.secondary">Selected</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card>
                <CardContent sx={{p: {xs: 1.5, sm: 2}}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: {xs: 1, sm: 2}}}>
                    <Avatar sx={{bgcolor: 'info.main', width: {xs: 32, sm: 40}, height: {xs: 32, sm: 40}}}>
                      <LocationOn sx={{fontSize: {xs: 16, sm: 24}}}/>
                    </Avatar>
                    <Box sx={{minWidth: 0}}>
                      <Typography variant={isMobile ? "body1" : "h6"}>{centers.length}</Typography>
                      <Typography variant="caption" color="text.secondary">Centers</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card>
                <CardContent sx={{p: {xs: 1.5, sm: 2}}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: {xs: 1, sm: 2}}}>
                    <Avatar sx={{bgcolor: 'primary.main', width: {xs: 32, sm: 40}, height: {xs: 32, sm: 40}}}>
                      <BatchPrediction sx={{fontSize: {xs: 16, sm: 24}}}/>
                    </Avatar>
                    <Box sx={{minWidth: 0}}>
                      <Typography variant={isMobile ? "body1" : "h6"}>{batches.length}</Typography>
                      <Typography variant="caption" color="text.secondary">Batches</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <Card>
                <CardContent sx={{p: {xs: 1.5, sm: 2}}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: {xs: 1, sm: 2}}}>
                    <Avatar sx={{bgcolor: 'warning.main', width: {xs: 32, sm: 40}, height: {xs: 32, sm: 40}}}>
                      <Event sx={{fontSize: {xs: 16, sm: 24}}}/>
                    </Avatar>
                    <Box sx={{minWidth: 0}}>
                      <Typography variant={isMobile ? "body1" : "h6"}>{sessions.length}</Typography>
                      <Typography variant="caption" color="text.secondary">Sessions</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Primary Filters - Responsive Grid */}
          <Grid container spacing={2} sx={{mb: 3}}>
            <Grid item xs={12} md={4} width={300}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Center</InputLabel>
                <Select
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    label="Center"
                    startAdornment={<LocationOn sx={{mr: 1, color: 'text.secondary'}}/>}
                >
                  {centers.map(center => (
                      <MenuItem key={center._id} value={center._id}>
                        <Box>
                          <Typography variant={isMobile ? "body2" : "body1"}>{center.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{center.location}</Typography>
                        </Box>
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} width={300}>
              <FormControl fullWidth disabled={!selectedCenter} size={isMobile ? "small" : "medium"}>
                <InputLabel>Batch</InputLabel>
                <Select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    label="Batch"
                    startAdornment={<BatchPrediction sx={{mr: 1, color: 'text.secondary'}}/>}
                >
                  {batches.map(batch => (
                      <MenuItem key={batch._id} value={batch._id}>
                        <Box>
                          <Typography variant={isMobile ? "body2" : "body1"}>{batch.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Current
                            Level: {batch.currentLevel}</Typography>
                        </Box>
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} width={300}>
              <FormControl fullWidth disabled={!selectedBatch} size={isMobile ? "small" : "medium"}>
                <InputLabel>Session</InputLabel>
                <Select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    label="Session"
                    startAdornment={<Event sx={{mr: 1, color: 'text.secondary'}}/>}
                >
                  {sessions.map(session => (
                      <MenuItem key={session._id} value={session._id}>
                        <Box>
                          <Typography variant={isMobile ? "body2" : "body1"}>{session.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Conductor
                            Name: {session.conductor.name}</Typography>
                        </Box>
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Expandable Filters */}
          <Card variant="outlined" sx={{mb: 3}}>
            <Box sx={{display: 'flex', alignItems: 'center', p: 2, cursor: 'pointer'}}
                 onClick={() => setFiltersExpanded(!filtersExpanded)}>
              <FilterList sx={{mr: 1}}/>
              <Typography variant={isMobile ? "body1" : "h6"} sx={{flexGrow: 1}}>
                Advanced Filters
              </Typography>
              {filtersExpanded ? <ExpandLess/> : <ExpandMore/>}
            </Box>
            <Collapse in={filtersExpanded}>
              <Divider/>
              <Box sx={{p: 2}}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Search Users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={!selectedCenter}
                        placeholder="Name or contact number"
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: <Search sx={{mr: 1, color: 'text.secondary'}}/>
                        }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Card>

          {/* Action Toolbar - Responsive */}
          {selectedCenter && (
              <Paper variant="outlined" sx={{mb: 3}}>
                <Toolbar
                    sx={{
                      minHeight: {xs: '56px', sm: '64px'},
                      flexDirection: {xs: 'column', sm: 'row'},
                      alignItems: {xs: 'stretch', sm: 'center'},
                      gap: {xs: 1, sm: 0}
                    }}
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexGrow: 1,
                    flexWrap: 'wrap',
                    mb: {xs: 1, sm: 0}
                  }}>
                    {selectedCenter_obj && (
                        <Chip
                            icon={<LocationOn/>}
                            label={selectedCenter_obj.name}
                            color="primary"
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                        />
                    )}
                    {selectedBatch_obj && (
                        <Chip
                            icon={<BatchPrediction/>}
                            label={selectedBatch_obj.name}
                            color="secondary"
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                        />
                    )}
                    {selectedSession_obj && (
                        <Chip
                            icon={<Event/>}
                            label={selectedSession_obj.name}
                            color="secondary"
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                        />
                    )}
                    {selectedUsers.size > 0 && (
                        <Chip
                            icon={<PersonAdd/>}
                            label={`${selectedUsers.size} selected`}
                            color="success"
                            size={isMobile ? "small" : "medium"}
                        />
                    )}
                  </Box>
                  <Box sx={{display: 'flex', gap: 1, width: {xs: '100%', sm: 'auto'}}}>
                    <Tooltip title="Refresh Data">
                      <IconButton onClick={loadUsers} disabled={loading} size={isMobile ? "small" : "medium"}>
                        <Refresh/>
                      </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        onClick={() => setShowConfirm(true)}
                        disabled={selectedUsers.size === 0 || !selectedSession || submitting}
                        startIcon={submitting ? <CircularProgress size={20}/> : <CheckCircle/>}
                        size={isMobile ? "small" : "large"}
                        fullWidth={isMobile}
                    >
                      {isMobile ? `Mark (${selectedUsers.size})` : `Mark Attendance (${selectedUsers.size})`}
                    </Button>
                  </Box>
                </Toolbar>
              </Paper>
          )}

          {/* Loading Progress */}
          {loading && <LinearProgress sx={{mb: 2}}/>}

          {selectedCenter && selectedSession && (
              <AttendanceSummary users={users} sessionId={selectedSession}/>
          )}

          {/* Users Display - Table for Desktop, Cards for Mobile */}
          {selectedCenter && (
              <>
                {isMobile ? (
                    // Mobile Card View
                    <Box sx={{mb: 2}}>
                      {loading ? (
                          <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                            <CircularProgress/>
                          </Box>
                      ) : users.length === 0 ? (
                          <Paper sx={{p: 4, textAlign: 'center'}}>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              No users found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your filters or search criteria
                            </Typography>
                          </Paper>
                      ) : (
                          <>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              p: 2,
                              bgcolor: 'action.hover',
                              borderRadius: 1
                            }}>
                              <Checkbox
                                  checked={isAllSelected}
                                  indeterminate={isIndeterminate}
                                  onChange={handleSelectAll}
                                  disabled={loading || users.length === 0}
                              />
                              <Typography variant="body2" sx={{ml: 1}}>
                                Select All ({users.length})
                              </Typography>
                            </Box>
                            {users.map(user => (
                                <MobileUserCard key={user._id} user={user}/>
                            ))}
                          </>
                      )}
                    </Box>
                ) : (
                    // Desktop Table View
                    <TableContainer component={Paper} variant="outlined" sx={{mb: 2}}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox">
                              <Checkbox
                                  checked={isAllSelected}
                                  indeterminate={isIndeterminate}
                                  onChange={handleSelectAll}
                                  disabled={loading || users.length === 0}
                              />
                            </TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                              <TableRow>
                                <TableCell colSpan={4} align="center" sx={{py: 8}}>
                                  <CircularProgress/>
                                  <Typography variant="body2" sx={{mt: 2}}>Loading users...</Typography>
                                </TableCell>
                              </TableRow>
                          ) : users.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} align="center" sx={{py: 8}}>
                                  <Typography variant="body1" color="text.secondary">
                                    No users found
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Try adjusting your filters or search criteria
                                  </Typography>
                                </TableCell>
                              </TableRow>
                          ) : (
                              users.map(user => {
                                const isSelected = selectedUsers.has(user._id);
                                return (
                                    <TableRow
                                        key={user._id}
                                        hover
                                        selected={isSelected}
                                        sx={{cursor: 'pointer'}}
                                        onClick={() => handleSelectUser(user._id)}
                                    >
                                      <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => handleSelectUser(user._id)}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                          <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                              {user.name}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                          {user.contact}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <AttendanceStatusCell
                                            user={user}
                                            sessionId={selectedSession}
                                            onStatusUpdate={updateAttendanceStatus}
                                        />
                                      </TableCell>
                                    </TableRow>
                                );
                              })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                )}
              </>
          )}

          {/* Pagination */}
          {selectedCenter && totalUsers > 0 && (
              <TablePagination
                  component="div"
                  count={totalUsers}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  showFirstButton={!isMobile}
                  showLastButton={!isMobile}
                  labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
                  sx={{
                    '.MuiTablePagination-toolbar': {
                      flexDirection: {xs: 'column', sm: 'row'},
                      gap: {xs: 1, sm: 0}
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      fontSize: {xs: '0.75rem', sm: '0.875rem'}
                    }
                  }}
              />
          )}

          {/* Confirmation Dialog - Responsive */}
          <Dialog
              open={showConfirm}
              onClose={() => setShowConfirm(false)}
              maxWidth="sm"
              fullWidth
              fullScreen={isMobile}
          >
            <DialogTitle sx={{pb: 1}}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <CheckCircle color="success"/>
                <Typography variant={isMobile ? "h6" : "h5"}>Confirm Attendance</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Alert severity="info" sx={{mb: 2}}>
                You are about to mark attendance for the following:
              </Alert>
              <Box sx={{mb: 2}}>
                <Typography variant="body2" gutterBottom>
                  <strong>Center:</strong> {selectedCenter_obj?.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Session:</strong> {selectedSession_obj?.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Users:</strong> {selectedUsers.size} selected
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                This action will mark all selected users as present for the chosen session.
              </Typography>
            </DialogContent>
            <DialogActions sx={{
              px: {xs: 2, sm: 3},
              pb: {xs: 2, sm: 2},
              flexDirection: {xs: 'column-reverse', sm: 'row'},
              gap: {xs: 1, sm: 0}
            }}>
              <Button
                  onClick={() => setShowConfirm(false)}
                  startIcon={<Cancel/>}
                  fullWidth={isMobile}
                  size={isMobile ? "large" : "medium"}
              >
                Cancel
              </Button>
              <Button
                  onClick={handleSubmitAttendance}
                  variant="contained"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20}/> : <CheckCircle/>}
                  fullWidth={isMobile}
                  size={isMobile ? "large" : "medium"}
              >
                {submitting ? 'Processing...' : 'Confirm Attendance'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Notification Snackbar - Responsive */}
          <Snackbar
              open={!!notification}
              autoHideDuration={4000}
              onClose={() => setNotification(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: isMobile ? 'center' : 'right'
              }}
              sx={{
                bottom: {xs: 80, sm: 24}
              }}
          >
            <Alert
                severity={notification?.type || 'success'}
                variant="filled"
                onClose={() => setNotification(null)}
                sx={{
                  width: {xs: '90vw', sm: 'auto'},
                  maxWidth: {xs: '350px', sm: 'none'}
                }}
            >
              {notification?.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
  );
}