/* import { Login } from "../../pages/Login"
import { render, screen, fireEvent} from "@testing-library/react"
import {expect, test} from 'vitest'
import '@testing-library/jest-dom'

test("shows error for invalid email", ()=>{
    render(<Login />)

    const input = screen.getByLabelText(/email/i)
    const button = screen.getByRole("button", {name: /submit/i })

    fireEvent.change(input, {
        target: { value: "invalid"}
    })

    fireEvent.click(button)

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
}) */
