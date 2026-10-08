package com.labrepair.labrepair.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Monitor extends Equipment {
    private Double screenSizeInch;
    private String resolution;
}
