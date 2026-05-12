import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Đặt tour ngay",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Xem thêm",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Hủy",
  },
};
