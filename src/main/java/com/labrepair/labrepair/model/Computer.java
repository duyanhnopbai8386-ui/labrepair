package com.labrepair.labrepair.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Computer extends Equipment {
    private String cpu;
    private Integer ramGb;
    private Integer storageGb;
}
