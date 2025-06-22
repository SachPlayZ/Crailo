"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useValidatorAdd, useValidatorRemove } from "@/utils/validator";
import { useStakeValidator } from "@/utils/validator";
import { useListing } from "@/utils/listing";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { addValidator, isPending: isAddValidatorPending } = useValidatorAdd();
  const { removeValidator, isPending: isRemoveValidatorPending } =
    useValidatorRemove();
  const {
    stakeAsValidator,
    unstakeValidator,
    isPending: isStakePending,
  } = useStakeValidator();
  const { createListing, isWritePending: isCreateListingPending } =
    useListing();

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      <div className="space-y-2 space-x-2">
        <Button
          onClick={() => addValidator("puchu")}
          disabled={isAddValidatorPending}
        >
          {isAddValidatorPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Add Validator
        </Button>
        <Button
          onClick={() => removeValidator("puchu")}
          disabled={isRemoveValidatorPending}
        >
          {isRemoveValidatorPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Remove Validator
        </Button>
        <Button onClick={() => stakeAsValidator()} disabled={isStakePending}>
          {isStakePending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Become Validator
        </Button>
        <Button onClick={() => unstakeValidator()} disabled={isStakePending}>
          {isStakePending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Unstake as Validator
        </Button>
        <Button
          onClick={() => createListing("Pa", "Ko", "Ra")}
          disabled={isCreateListingPending}
        >
          {isCreateListingPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Create Listing
        </Button>
      </div>
    </div>
  );
};

export default Page;
