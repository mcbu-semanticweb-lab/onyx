FROM ubuntu:18.10
RUN apt-get update && apt-get install -y curl && apt-get install -y git && apt-get install -y locales
RUN locale-gen en_US.UTF-8
RUN useradd -m ontoboy
USER ontoboy
RUN curl "https://install.meteor.com/?release=1.6" | sh
ENV PATH="/home/ontoboy/.meteor:${PATH}"
COPY --chown=ontoboy . /home/ontoboy/OntoMirror
WORKDIR /home/ontoboy/OntoMirror
RUN meteor npm install
CMD meteor npm start
