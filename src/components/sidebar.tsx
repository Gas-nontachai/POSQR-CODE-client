import { FC, useState } from "react";
import { List, ListItem, ListItemButton, ListItemText, Divider, Collapse } from "@mui/material";
import { Home, Restaurant, Category, Tune, ShoppingCart, TableChart, BarChart, People, ExpandLess, ExpandMore, ContactMail, ExitToApp, SupportAgent } from "@mui/icons-material";

const Sidebar: FC = () => {
    const [openManage, setOpenManage] = useState(false);

    return (
        <div className="w-64 bg-[#fff] text-gray-700 h-full fixed left-0 top-0 p-4 flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Sidebar</h2>
            <List>
                {/* Home Link */}
                <ListItem disablePadding>
                    <ListItemButton component="a" href="/">
                        <Home className="mr-3" />
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                <Divider light />
                <ListItem disablePadding>
                    <ListItemButton component="a" href="/screen">
                        <SupportAgent className="mr-3" />
                        <ListItemText primary="Customer" />
                    </ListItemButton>
                </ListItem>
                <Divider light />
                {/* Manage Section */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setOpenManage(!openManage)}>
                        <Tune className="mr-3" />
                        <ListItemText primary="Manage" />
                        {openManage ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={openManage} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem disablePadding>
                            <ListItemButton component="a" href="/menu" sx={{ ml: 2 }}>
                                <Restaurant className="mr-3" />
                                <ListItemText primary="Menu" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" href="/category" sx={{ ml: 2 }}>
                                <Category className="mr-3" />
                                <ListItemText primary="Category" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" href="/order" sx={{ ml: 2 }}>
                                <ShoppingCart className="mr-3" />
                                <ListItemText primary="Order" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" href="/table" sx={{ ml: 2 }}>
                                <TableChart className="mr-3" />
                                <ListItemText primary="Table" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" href="/table-status" sx={{ ml: 2 }}>
                                <BarChart className="mr-3" />
                                <ListItemText primary="Table Status" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" href="/user" sx={{ ml: 2 }}>
                                <People className="mr-3" />
                                <ListItemText primary="User" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Collapse>
                <Divider light />

                {/* Contact Link */}
                {/* <ListItem disablePadding>
                    <ListItemButton component="a" href="/contact">
                        <ContactMail className="mr-3" />
                        <ListItemText primary="Contact" />
                    </ListItemButton>
                </ListItem> */}

                {/* Logout Link */}
                <ListItem disablePadding >
                    <ListItemButton component="a" href="/logout">
                        <ExitToApp className="mr-3" />
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
            <div className="mt-auto text-center text-xs text-gray-400">
                <p>© 2025 Nontachai</p>
            </div>
        </div>
    );
};

export default Sidebar;
