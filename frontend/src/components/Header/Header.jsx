import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Logo, LogoutBtn } from "../index";
function Header() {
    const authStatus = useSelector((state) => state.auth.status);

    const navigate = useNavigate();

    const navItems = [
        {
            name: "Home",
            slug: "/",
            active: true
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "Dashboard",
            slug: "/dashboard",
            active: !authStatus,
        },
    ]

    return (
        <header>
            <Container>
                <nav className="flex py-4 px-6 bg-purple-300 items-center">
                    <div className="mr-4">
                        <Logo></Logo>
                    </div>

                    <ul className="flex ml-auto gap-4">
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name} >
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className='inline-bock px-6 py-2 bg-purple-600 duration-200 hover:bg-[#8741c9] rounded-full'
                                    >{item.name}</button>
                                </li>
                            ) : null
                        )}
                        {
                            authStatus && (
                                <li>
                                    <LogoutBtn></LogoutBtn>
                                </li>
                            )
                        }
                    </ul>
                </nav>
            </Container>
        </header>
    );
}

export default Header;


