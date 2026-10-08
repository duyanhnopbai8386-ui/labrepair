package com.labrepair.labrepair.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Projector extends Equipment {
    private Integer brightnessLumens;
    private String nativeResolution;
}
