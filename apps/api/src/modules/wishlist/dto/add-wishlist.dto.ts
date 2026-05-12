import { IsIn, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO for adding an item to the wishlist.
 * Req 14 / Design §3.3 Wishlist.
 */
export class AddWishlistDto {
  @ApiProperty({ description: "Tour ID or Destination ID", example: "clxyz123" })
  @IsString()
  itemId!: string;

  @ApiProperty({
    enum: ["TOUR", "DESTINATION"],
    description: "Type of the item being added to the wishlist",
    example: "TOUR"
  })
  @IsString()
  @IsIn(["TOUR", "DESTINATION"])
  itemType!: "TOUR" | "DESTINATION";
}
