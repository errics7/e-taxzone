import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

const useStyles = makeStyles((theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

export default function ItemSideNav(props) {
  const { locHistory, routeSelcted, text, icon, level = 0 } = props;
  const classes = useStyles();
  const isActive = locHistory === routeSelcted

  return (
    <div
      className={`my-1  mx-5 relative ${isActive ? "bg-white text-[#2D70AE] font-bold rounded-2xl" : ""
        }`}
    >
      {/* {locHistory === routeSelcted && (
        <div className="bg-red-400 absolute inset-y-0 left-0 w-0.5"></div>
      )} */}
      <ListItem button className={level === 1 ? classes.nested : null}>
        <ListItemIcon className={`${isActive ? '!text-[#EFA929]' : ''}`}>{icon}</ListItemIcon>
        <ListItemText sx={{ fontWeight: 'bold' }} className='font-bold' primary={text} />
      </ListItem>
    </div>
  );
}
