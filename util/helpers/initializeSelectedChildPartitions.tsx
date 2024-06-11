import { AdGroupCriterionResource, CriterionData } from "@/types";

export const initializeSelectedChild = (
  criterionData: CriterionData[],
  children: AdGroupCriterionResource[],
  selectedNodeId: number | null
) => {
  const updatedSelection: { [key: string | number]: boolean } = {};
  criterionData?.forEach((partition) => {
    //check if the retrieved partitions parentId is a child of selectedNodeId
    if (Number(partition?.parentId) === selectedNodeId) {
      //check for conditions where at least one f the child ids exist already in our product group view
      const isChildPartition = children?.some(
        (child) => child?.criterion_id === partition?.partitionId
      );
      updatedSelection[partition?.partitionId] = isChildPartition;
    }
  });
  return updatedSelection;
};
