# SafeInfra Dataset Summary

## Source Dataset

The dataset is based on the publicly available Yushu and Ludian building-damage datasets from the city292/build_assessment repository.

## Original Classes

- Class 0: Intact
- Class 1: Slightly damaged
- Class 2: Severely damaged
- Class 3: Collapsed

## SafeInfra Class Mapping

- Class 0 (Intact) -> Low
- Class 1 (Slightly damaged) -> Medium
- Class 2 (Severely damaged) -> High
- Class 3 (Collapsed) -> Critical

## Preprocessing

- Combined Yushu and Ludian images
- Removed no images based on class
- Converted TIFF images to RGB JPEG
- Resized every image to 224x224 pixels
- Randomly shuffled the complete dataset
- Split into approximately 70% training, 15% validation, and 15% testing
- Random seed: 42

## Image Counts

### Train

- Low: 1954
- Medium: 3367
- High: 1906
- Critical: 2520

### Val

- Low: 412
- Medium: 687
- High: 432
- Critical: 557

### Test

- Low: 450
- Medium: 707
- High: 434
- Critical: 499

### Total

- Low: 2816
- Medium: 4761
- High: 2772
- Critical: 3576

- **Total images: 13925**
