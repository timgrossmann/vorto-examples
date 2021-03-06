/**
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */
package org.eclipse.vorto.example.mapping.handler;

import org.eclipse.vorto.model.runtime.InfomodelValue;

/**
 * Handler to be implemented by the application to process the normalized device data.
 * Example handlers could be storing the data in Digital Twin service 
 *
 */
public interface IPayloadHandler {

  /**
   * Handles the normalized device payload
   * @param value normalized/mapped device data complying to Vorto Information Model
   * @param context context information about the payload, such as device ID
   */
  void handlePayload(InfomodelValue value, Context context);
}
