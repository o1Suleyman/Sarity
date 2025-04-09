import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createClient } from "@/utils/supabase/client";
import Workout from "@/components/workouts/workout";
import { useRouter } from "next/navigation";

// Mock the dependencies
jest.mock("@/utils/supabase/client");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Workout Component", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };
  const mockSets = [
    {
      id: 1,
      name: "bench",
      minutes: 10,
      workout_id: 1,
      created_at: "2025-04-08T10:00:00Z",
    },
    {
      id: 2,
      name: "squat",
      minutes: 15,
      workout_id: 1,
      created_at: "2025-04-08T10:15:00Z",
    },
    {
      id: 3,
      name: "deadlift",
      minutes: 20,
      workout_id: 1,
      created_at: "2025-04-08T10:35:00Z",
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockSets, error: null }),
      order: jest.fn().mockResolvedValue({ data: mockSets, error: null }),
      insert: jest.fn().mockResolvedValue({ data: mockSets, error: null }),
      delete: jest.fn().mockResolvedValue({ data: null, error: null }),
    });
  });

  it("renders loading state initially", () => {
    render(<Workout id="1" />);
    expect(screen.getByText("Loading sets...")).toBeInTheDocument();
  });

  it("renders sets after loading", async () => {
    render(<Workout id="1" />);
    await waitFor(() => {
      expect(screen.getByText("Bench Press")).toBeInTheDocument();
      expect(screen.getByText("10 minutes")).toBeInTheDocument();
    });
  });

  it("opens add set drawer when clicking Add Set button", async () => {
    render(<Workout id="1" />);
    const addButton = screen.getByText("Add Set");
    fireEvent.click(addButton);
    expect(screen.getByText("Add a New Set")).toBeInTheDocument();
  });

  it("handles set deletion", async () => {
    render(<Workout id="1" />);
    await waitFor(() => {
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);
    });
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("handles adding new set", async () => {
    render(<Workout id="1" />);

    // Open drawer
    fireEvent.click(screen.getByText("Add Set"));

    // Fill form
    const exerciseSelect = screen.getByLabelText("Exercise");
    fireEvent.change(exerciseSelect, { target: { value: "bench" } });

    const minutesInput = screen.getByLabelText("Minutes");
    fireEvent.change(minutesInput, { target: { value: "15" } });

    // Submit form
    const addButton = screen.getByRole("button", { name: /^Add$/ });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
