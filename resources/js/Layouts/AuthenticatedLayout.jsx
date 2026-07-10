import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile' })(
     ({ theme, open, isMobile }) => ({
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: isMobile ? 'none' : theme.transitions.create('margin', {
               easing: theme.transitions.easing.sharp,
               duration: theme.transitions.duration.leavingScreen
          }),
          marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
          ...(!isMobile && open && {
               transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen
               }),
               marginLeft: 0
          })
     })
);

const AppBarStyled = styled(AppBar, {
     shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
})(({ theme, open, isMobile }) => ({
     transition: isMobile ? 'none' : theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
     }),
     ...(!isMobile && open && {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
               easing: theme.transitions.easing.easeOut,
               duration: theme.transitions.duration.enteringScreen,
          })
     })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
     display: 'flex',
     alignItems: 'center',
     padding: theme.spacing(0, 1),
     ...theme.mixins.toolbar,
     justifyContent: 'flex-end'
}));

const AuthenticatedLayout = ({ user, children, header, isTeacher }) => {
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
     const [open, setOpen] = React.useState(!isMobile);

     // وقتی سایز صفحه تغییر می‌کند، وضعیت دراور را به‌روز کن
     React.useEffect(() => {
          setOpen(!isMobile);
     }, [isMobile]);

     const handleDrawerOpen = () => setOpen(true);
     const handleDrawerClose = () => setOpen(false);

     const handleLogout = async () => {
          try {
               await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
               await axios.post('/logout', {}, {
                    withCredentials: true,
                    headers: {
                         'Content-Type': 'application/json',
                         'X-Requested-With': 'XMLHttpRequest'
                    }
               });
               toast.success('با موفقیت خارج شدید');
               setTimeout(() => {
                    window.location.href = '/login';
               }, 800);
          } catch (err) {
               console.error(err);
               toast.error('خطا در خروج از حساب');
          }
     };

     const TeacherMenuItems = [
          { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'آزمون‌ها', icon: <QuizIcon />, path: '/exams' },
          { text: 'سوالات', icon: <QuestionAnswerIcon />, path: '/questions' },
          { text: 'نتایج', icon: <AssessmentIcon />, path: '/results' }
     ];

     const StudentMenuItems = [
          { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'آزمون‌ها', icon: <QuizIcon />, path: '/exams' },
          { text: 'نتایج من', icon: <AssessmentIcon />, path: '/my-results' }
     ];

     return (
          <Box sx={{ display: 'flex', direction: 'ltr' }}>
               <ToastContainer position="top-right" rtl />

               <AppBarStyled position="fixed" open={open} isMobile={isMobile}>
                    <Toolbar>
                         <IconButton
                              color="inherit"
                              aria-label="open drawer"
                              onClick={handleDrawerOpen}
                              edge="start"
                              sx={{ mr: 2, ...(open && !isMobile && { display: 'none' }) }}
                         >
                         <MenuIcon />
                         </IconButton>
                         <Typography variant="h6" noWrap component="div" sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' } }}>
                              {header || 'پلتفرم آزمون آنلاین'}
                         </Typography>
                         <Box sx={{ flexGrow: 1 }} />
                         <Typography variant="body2" sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
                              {user?.name}
                         </Typography>
                         <IconButton color="inherit" onClick={handleLogout}>
                         <LogoutIcon />
                         </IconButton>
                    </Toolbar>
               </AppBarStyled>

               <Drawer
                    sx={{
                         width: drawerWidth,
                         flexShrink: 0,
                         '& .MuiDrawer-paper': {
                         width: drawerWidth,
                         boxSizing: 'border-box'
                         }
                    }}
                    variant={isMobile ? 'temporary' : 'persistent'}
                    anchor="left"
                    open={open}
                    onClose={isMobile ? handleDrawerClose : undefined}
               >
                    <DrawerHeader>
                         <IconButton onClick={handleDrawerClose}>
                         {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                         </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                         {isTeacher ? TeacherMenuItems.map((item) => (
                         <ListItem key={item.text} disablePadding>
                              <ListItemButton component="a" href={item.path}>
                                   <ListItemIcon>{item.icon}</ListItemIcon>
                                   <ListItemText primary={item.text} />
                              </ListItemButton>
                         </ListItem>
                         )) : StudentMenuItems.map((item) => (
                         <ListItem key={item.text} disablePadding>
                              <ListItemButton component="a" href={item.path}>
                                   <ListItemIcon>{item.icon}</ListItemIcon>
                                   <ListItemText primary={item.text} />
                              </ListItemButton>
                         </ListItem>
                         ))}
                    </List>
               </Drawer>

               <Main open={open} isMobile={isMobile}>
                    <DrawerHeader />
                    {children}
               </Main>
          </Box>
     );
};

export default AuthenticatedLayout;