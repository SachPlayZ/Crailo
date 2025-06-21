"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useValidatorAdd, useValidatorRemove } from "@/utils/validator";
import { useStakeValidator } from "@/utils/validator";
import { useListing } from "@/utils/listing";

const Page = () => {
  const { addValidator } = useValidatorAdd();
  const { removeValidator } = useValidatorRemove();
  const { stakeAsValidator, unstakeValidator } = useStakeValidator();
  const { createListing } = useListing();

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      <div className="space-y-2 space-x-2">
        <Button onClick={() => addValidator("puchu")}>Add Validator</Button>
        <Button onClick={() => removeValidator("puchu")}>
          Remove Validator
        </Button>
        <Button onClick={() => stakeAsValidator()}>Become Validator</Button>
        <Button onClick={() => unstakeValidator()}>Unstake as Validator</Button>
        <Button onClick={() => createListing("Pa", "Ko", "Ra")}>
          Create Listing
        </Button>
      </div>
    </div>
  );
};

export default Page;
